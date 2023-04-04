import React, { Component } from "react";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import Skeleton from "react-skeleton-loader";

import getLanguage from "getLanguage.js";
import languages from "../languages";

import "./DownloadCenter.scss";

import MobileNotSupported from "../../MobileNotSupported";
import ActionCheckBox from "Components/ActionCheckBox/ActionCheckBox";
import Sidebar from "Components/Sidebar/Sidebar";
import Searchbar from "Components/Searchbar/Searchbar";
import moment from "moment";
import StaticDropdown from "Components/StaticDropdown";
import events from "../../utils/events";
import languagesReport from "../../utils/languageReport";
import * as XLSX from "xlsx/xlsx.mjs";
import { operations as metricsOperations } from "../../views/ConversationMetrics/duck";
import _ from "lodash";

const language = languages[getLanguage()];
const languageReport = languagesReport[getLanguage()];

const MAX_REPORTS = 20;
const RETRY_REPORTS = "RETRY_REPORTS";
const DELETE_REPORTS = "DELETE_REPORTS";
const SUCCESS = "SUCCESS";
const PROCESSING = "PROCESSING";
const ERROR = "ERROR";

export class DownloadCenterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchReport: "",
      reportFormat: "",
      countNotification: 0,
    };
  }

  componentDidMount() {
    const countNotification = parseInt(
      localStorage.getItem("countNotification")
    );

    if (this.props.showDownloadCenter) {
      this.setState({ countNotification: 0 });
    } else if (countNotification && countNotification > 0) {
      this.setState({ countNotification });
    }

    let reportsAmountBeforeNewReport = localStorage.getItem(
      "reportsAmountBeforeNewReport"
    );
    console.log("download center start", reportsAmountBeforeNewReport);
    if (!reportsAmountBeforeNewReport) {
      localStorage.setItem("reportsAmountBeforeNewReport", 0);
    }

    this.props.getUserReports();

    this.reportPolling = setInterval(
      () => this.props.getUserReports(),
      1000 * 60
    );
  }

  componentWillUnmount() {
    clearInterval(this.reportPolling);
  }

  componentDidUpdate(prevProps, prevState) {
    let reportsAmountBeforeNewReport = localStorage.getItem(
      "reportsAmountBeforeNewReport"
    );

    if (
      this.props.userReports.length &&
      reportsAmountBeforeNewReport > this.props.userReports.length
    ) {
      localStorage.setItem(
        "reportsAmountBeforeNewReport",
        this.props.userReports.length
      );
    }

    if (
      !_.isEqual(prevProps.userReports, this.props.userReports) &&
      reportsAmountBeforeNewReport &&
      this.props.userReports.length != 0 &&
      reportsAmountBeforeNewReport < this.props.userReports.length
    ) {
      let pendingReports =
        this.props.userReports.length - reportsAmountBeforeNewReport;
      let reports = this.props.userReports.sort((a, b) => b.id - a.id);

      let count = 0;
      for (let i = 0; i < pendingReports; i++) {
        let curReport = reports[i];
        if (curReport.status === SUCCESS) {
          this.reportToaster(
            language.reportSuccessNotification,
            curReport,
            () => this.downloadReport(curReport)
          );
        }
        if (curReport.status === ERROR) {
          this.reportToaster(language.reportErrorNotification, curReport, () =>
            this.props.retryUserReports([curReport.id], languageReport)
          );
        }
        if (curReport.status !== PROCESSING) count++;
      }
      if (count > 0) {
        this.updateReportNotification(this.state.countNotification + count);
        localStorage.setItem(
          "reportsAmountBeforeNewReport",
          this.props.userReports.length
        );
      }
    }
  }

  mapperReportAction = (report) => {
    const status = report.status;
    let action = {};
    if (status === SUCCESS) {
      action = {
        icon: "download-reports",
        text: language.downloadReport,
        trigger: () => {
          events.track("Download center click on download report");
          this.downloadReport(report);
        },
      };
    } else if (status === PROCESSING) {
      action = {
        icon: "trash-mask",
        text: language.cancelDownload,
        trigger: () => {
          events.track("Download center cancel report");
          this.props.deleteUserReports([report.id]);
        },
      };
    } else {
      action = {
        icon: "retry-mask",
        text: language.regenerateReport,
        trigger: () => {
          events.track("Download center retry report");
          this.props.retryUserReports([report.id], languageReport);
        },
      };
    }
    return action;
  };

  getReportType = (type) => {
    type = type == 'GENERAL_REPORT' ? 'general' : type.replace(/_|INBOUND|OUTBOUND/g, "").toLowerCase();
    return language[type + "Report"];
  };

  reportToaster = (text, report = null, reportAction = null) => {
    text = text.split("--");
    toast(
      <p
        onClick={() => {
          if (reportAction) reportAction();
        }}
      >
        {text[0]}
        {reportAction && <span>{text[1]}</span>}
      </p>,
      {
        position: "top-center",
        className: `report-toast ${
          report ? report.status.toLowerCase() : "error"
        }`,
        bodyClassName: "report-toast-body",
        closeOnClick: false,
        hideProgressBar: true,
        autoClose: 10000,
        closeButton: ({ closeToast }) => (
          <div className=" button-close" onClick={closeToast}>
            <div className="icon icon--close-mask" />
          </div>
        ),
      }
    );
  };

  updateReportNotification = (val) => {
    this.setState({
      countNotification: val,
    });
    localStorage.setItem("countNotification", val);
  };

  downloadReport = (report) => {
    console.log("report type: ", report.type, report.id)
    fetch(report.path, {
      method: "get",
      cache: "no-cache",
      referrerPolicy: "no-referrer",
    })
      .then((res) => res.text())
      .then((res) => {
        const wb = XLSX.read(res, { type: "string" });
        const poll = report.poll_info;
        const title_filename = poll ? `${poll.name} (${poll.id})`: 'general-report'
        const filename = `${title_filename} - ${this.getReportType(
          report.type
        )}.${report.format.toLowerCase()}`;
        XLSX.writeFile(wb, filename, { compression: true });
      });
  };

  filterReports = (reports, filter) => {
    if (filter) {
      reports = reports.filter(
        (report) =>
          report.poll_info &&
          (report.poll_info.name.toLowerCase().includes(filter.toLowerCase()) ||
            String(report.poll_info.id).includes(filter))
      );
    }
    reports = reports.sort((a, b) => {
      return b.created_at - a.created_at;
    });
    return reports;
  };

  renderNoReports = () => {
    return (
      <div className="no-results">
        <div className="no-events-img" />
        <p>{language.noReportsYet}</p>
      </div>
    );
  };

  renderReportsSkeleton = () => {
    return (
      <div className="reports-body">
        <div className="actions">
          <Skeleton width="200px" />
          <Skeleton width="60px" />
        </div>
        <div className="search-skeleton">
          <div className="icon icon--search-mask" />
          <Skeleton width="229px" />
        </div>
        <div className="reports is-loading">
          {[SUCCESS, PROCESSING, ERROR].map((status) => (
            <div className="report-card">
              <div className="title is-loading">
                <div
                  className={`icon icon--report-${status.toLocaleLowerCase()}-mask`}
                />
                <Skeleton width="214px" height="14px" />
              </div>
              <div className="type-section">
                <Skeleton width="99px" />
              </div>
              <Skeleton width="251px" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  renderDownloadCenter = () => {
    const { showDownloadCenter } = this.props;
    let body = this.renderReportsBody();
    if (this.props.loadingReports) body = this.renderReportsSkeleton();
    return (
      <Sidebar
        class="siderbar-download-center"
        show={showDownloadCenter}
        close={() => {
          this.setState({
            searchReport: "",
          });
          this.props.setShowDownloadCenter(false);
        }}
        title={
          <>
            <div className="icon icon--download-center-hover" />
            <h2>{language.downloadCenter}</h2>
          </>
        }
        body={body}
      />
    );
  };

  renderNoSearchResults = () => {
    return (
      <div className="no-results">
        <div className="no-results-image" />
        <p>{language.noSearchResults}</p>
      </div>
    );
  };

  renderReportsBody = () => {
    const { searchReport } = this.state;
    const userReports = this.filterReports(
      this.props.userReports,
      searchReport
    );
    const actions = [];
    if (
      this.props.userReports.filter((report) => report.status === ERROR).length
    ) {
      actions.push({
        icon: "retry-mask",
        opt: RETRY_REPORTS,
        name: language.retryAllReports,
      });
    }
    actions.push({
      icon: "trash-mask",
      opt: DELETE_REPORTS,
      name: language.deleteAllReports,
    });
    const hasReports = this.props.userReports.length > 0 ? true : false;
    return (
      <div className="reports-body">
        <div className="actions">
          <div className="reports-count">
            <h2>{language.generatedReports}</h2>
            <p>{`${userReports.length}/${MAX_REPORTS}`}</p>
          </div>
          <ActionCheckBox
            class="reports-action-checkbox"
            title={language.selectAction}
            loading={this.props.loading}
            runAction={language.runAction}
            actionRuning={language.actionRuning}
            openContent={hasReports}
            trigger={
              <div className={`button ${!hasReports ? "no-reports" : " "}`}>
                <p>{language.reportActions}</p>
              </div>
            }
            actionList={actions}
            triggerAction={(action) => {
              if (action.opt === RETRY_REPORTS) {
                events.track("Download center retry all failed reports");
                this.props.retryUserReports(
                  this.props.userReports
                    .filter((report) => report.status === ERROR)
                    .map((report) => report.id),
                  languageReport
                );
              } else {
                events.track("Download center delete all reports");
                this.props.deleteUserReports(
                  this.props.userReports.map((report) => report.id)
                );
              }
            }}
          />
        </div>
        {hasReports && (
          <Searchbar
            class="searchbar-reports"
            placeholder={language.searchReport}
            onChange={(value) => this.setState({ searchReport: value })}
            value={searchReport}
            clearButton={true}
            clear={() => this.setState({ searchReport: "" })}
            trackMessage="Download center search"
          />
        )}
        <div className="reports">
          {userReports.length
            ? userReports.map((report) => this.renderReport(report))
            : searchReport
            ? this.renderNoSearchResults()
            : this.renderNoReports()}
        </div>
      </div>
    );
  };

  formatReportDate = (date, hours = false) => {
    const format = `DD/MM/YYYY ${hours ? "- HH:mm" : ""}`;
    return moment(moment(date * 1000).toDate())
      .local()
      .format(format);
  };

  renderReport = (report) => {
    const createdAt = this.formatReportDate(report.created_at, true);
    const startDate = this.formatReportDate(report.start_date);
    const endDate = this.formatReportDate(report.end_date);
    const reportAction = this.mapperReportAction(report);
    const reportType = this.getReportType(report.type);
    const poll = report.poll_info;
    return (
      <StaticDropdown
        dropdownArrow={"dropdown-arrow-2"}
        triggerComponent={
          <div className="report-card">
            <div className="title">
              <div
                className={`icon icon--report-${report.status.toLowerCase()}-mask`}
              />
              <p>{poll ? `${poll.id} ${poll.name}` : "General report"}</p>
            </div>

            <div className="type-section">
              <div className="type">
                <p>{reportType}</p>
              </div>
              {report.status === PROCESSING && <div className="progress-bar" />}
              <div className="icon icon--dropdown-arrow-2" />
            </div>
            <div className="date">
              <p>
                {language.generatedDate}: {createdAt}
              </p>
            </div>
          </div>
        }
      >
        <div className="report-info">
          <div className="info">
            <div className="icon icon--doc" />
            <p>{report.format}</p>
          </div>
          <div className="info">
            <div className="icon icon--calendar" />
            <p>
              {startDate} - {endDate}
            </p>
          </div>
          {report.status === "pending" && (
            <div className="info">
              <div className="icon icon--thunder" />
              <p>{language.reportBeingGenerated}</p>
            </div>
          )}
        </div>
        <div className="report-actions">
          <div className="button action" onClick={() => reportAction.trigger()}>
            <div className={`icon icon--${reportAction.icon}`} />
            <p>{reportAction.text}</p>
          </div>
          {[SUCCESS, ERROR].includes(report.status) && (
            <div
              className="button delete-action"
              onClick={() => {
                if (report.status === SUCCESS)
                  events.track("Download center delete report");
                else events.track("Download center delete failed report");
                this.props.deleteUserReports([report.id]);
              }}
            >
              <div className="icon icon--trash-mask"></div>
            </div>
          )}
        </div>
      </StaticDropdown>
    );
  };

  render() {
    const { countNotification } = this.state;
    return (
      <>
        <div
          className="button-download-center"
          onClick={() => {
            events.track("Open download center");
            this.updateReportNotification(0);
            this.props.setShowDownloadCenter(true);
          }}
        >
          <div className="icon icon--download-center" />
          {countNotification > 0 && (
            <div className="count-notification">
              <p>{countNotification}</p>
            </div>
          )}
        </div>
        {this.renderDownloadCenter()}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { conversationMetricsReducer } = state;

  return {
    userReports: conversationMetricsReducer.userReports,
    loading: conversationMetricsReducer.loading,
    loadingReports: conversationMetricsReducer.loadingReports,
  };
};

const mapDispatchToProps = (dispatch) => {
  const getUserReports = () => {
    dispatch(metricsOperations.getUserReports());
  };

  const retryUserReports = (reports) => {
    dispatch(metricsOperations.retryUserReports(reports));
  };

  const deleteUserReports = (reports) => {
    dispatch(metricsOperations.deleteUserReports(reports));
  };

  return {
    getUserReports,
    retryUserReports,
    deleteUserReports,
  };
};

const DownloadCenter = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadCenterComponent);

export default DownloadCenter;
