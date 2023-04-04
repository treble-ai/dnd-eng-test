import React, { Component } from "react";
import Calendar from "Components/Calendar";
import moment from "moment";
import "./CalendarPicker.scss";
import events from "utils/events";

/*
	props:
		- options list(obj): options to be displayed
		- noSelectionTitle str: text to be displayed when empty
		- display function(obj) -> str: a map between an object an its display
		- onSelect function([obj]): to be called when an option is clicked, it calls all the clicked objects
*/
const dateOptions = [
  "everything",
  "today",
  "yesterday",
  "last7days",
  "lastweek",
  "last30days",
  "lastmonth",
];

const typeToEventName = {
  init: "start",
  end: "end",
};
class CalendarPicker extends Component {
  constructor(props) {
    super(props);

    let options = this.props.options;

    this.state = {
      open: false,
      selectedStartDate: null,
      selectedEndDate: moment().local(),
      selectedDateOption: "everything",
    };

    this.handleCalendarEvent = this.handleCalendarEvent.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.forceOpen != this.props.forceOpen &&
      this.props.forceOpen == "init"
    ) {
      this.setState({ open: "init" });
    }
  }
  handleCalendarEvent(date, type) {
    if (this.props.eventPrefix) {
      events.track(this.props.eventPrefix + typeToEventName[type], {
        Date: date,
      });
    }

    if (type == "init") {
      if (moment(date).diff(this.state.selectedEndDate) > 1) {
        this.setState({
          selectedStartDate: date,
          selectedEndDate: date,
        });
      } else {
        this.setState({ selectedStartDate: date });
      }
    } else {
      if (moment(date).diff(this.state.selectedStartDate) < 1) {
        this.setState({
          selectedStartDate: date,
          selectedEndDate: date,
        });
      } else {
        this.setState({ selectedEndDate: date });
      }
    }
    this.setState({ selectedDateOption: null });
  }
  getHoursFromTodayToTime(n) {
    let date = new Date();
    let endDate, startDate;
    date.setDate(date.getDate() - n);
    date.setHours(23, 59, 59, 99);
    endDate = moment(date.toUTCString()).format("X");
    date.setHours(0, 0, 0, 0);
    startDate = moment(date.toUTCString()).format("X");
    this.setState({
      selectedEndDate: moment(endDate * 1000).local(),
      selectedStartDate: moment(startDate * 1000).local(),
    });
    return [endDate, startDate];
  }

  renderDatesDropdown(type) {
    let { selectedEndDate, selectedStartDate, selectedDateOption } = this.state;
    if (!selectedStartDate)
      selectedStartDate = moment.utc(this.props.startDate * 1000).local();
    let date = type == "init" ? selectedStartDate : selectedEndDate;

    return (
      <div className="dropdown-content-calendar">
        <div className="date-and-calendar">
          <div className="date-opt">
            {dateOptions.map((e) => {
              return (
                <p
                  className={`${selectedDateOption == e ? "is-selected" : ""}`}
                  onClick={() => {
                    if (this.props.eventPrefix) {
                      events.track(this.props.eventPrefix + "select", {
                        Select: e,
                      });
                    }
                    this.setState({ selectedDateOption: e });
                  }}
                  key={e}
                >
                  {this.props.language[e]}
                </p>
              );
            })}
          </div>
          <Calendar
            onSelect={this.handleCalendarEvent}
            type={type}
            date={date}
          />
        </div>
        <div className="save-and-cancel">
          <button
            className="btn btn--cancel"
            onClick={() => this.handleSaveAndCancelButtons("close")}
          >
            Cancelar
          </button>
          <button
            className="btn btn--save"
            onClick={() => this.handleSaveAndCancelButtons("save")}
          >
            Guardar
          </button>
        </div>
      </div>
    );
  }

  handleSaveAndCancelButtons(type) {
    if (type == "close") {
      this.setState({ open: null });
    } else {
      this.sendNewDates();
      this.setState({ open: null });
    }
  }

  formatDateToReadableText(date) {
    return (
      this.props.language[date.format("MMMM")].slice(0, 3) +
      " " +
      date.format("D") +
      ", " +
      date.format("Y")
    );
  }
  handleDateOnClick(type) {
    if (this.state.open == type) {
      this.setState({ open: null });
    } else {
      this.setState({ open: type });
    }
  }
  sendNewDates() {
    let { selectedEndDate, selectedStartDate, selectedDateOption } = this.state;
    let startDate, endDate;
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    let endDateRelative = moment(end.toUTCString()).format("X");
    if (selectedDateOption == null) {
      if (!selectedStartDate)
        selectedStartDate = moment.utc(this.props.startDate * 1000).local();
      startDate = selectedStartDate.startOf("day").utc().unix();
      if (selectedEndDate.format("MM-DD-YY") == moment().format("MM-DD-YY")) {
        endDate = endDateRelative;
      } else {
        endDate = moment(selectedEndDate).local().endOf("day").format("X");
      }
    } else {
      let now = moment().local();
      if (selectedDateOption == "today") {
        startDate = now.startOf("day").utc().unix();
        endDate = endDateRelative;
        this.setState({
          selectedStartDate: moment(startDate * 1000).local(),
          selectedEndDate: moment(endDate * 1000).local(),
        });
      } else if (selectedDateOption == "yesterday") {
        let dates = this.getHoursFromTodayToTime(1);
        startDate = dates[1];
        endDate = dates[0];
      } else if (selectedDateOption == "last7days") {
        let dates = this.getHoursFromTodayToTime(7);
        startDate = dates[1];
        endDate = endDateRelative;
        this.setState({
          selectedEndDate: moment(endDateRelative * 1000).local(),
        });
      } else if (selectedDateOption == "last30days") {
        let dates = this.getHoursFromTodayToTime(30);
        startDate = dates[1];
        endDate = endDateRelative;
        this.setState({
          selectedEndDate: moment(endDateRelative * 1000).local(),
        });
      } else if (selectedDateOption == "lastweek") {
        startDate = moment()
          .subtract(1, "weeks")
          .startOf("isoWeek")
          .format("X");
        endDate = moment().subtract(1, "weeks").endOf("isoWeek").format("X");
        this.setState({
          selectedEndDate: moment(endDate * 1000).local(),
          selectedStartDate: moment(startDate * 1000).local(),
        });
      } else if (selectedDateOption == "lastmonth") {
        startDate = moment().subtract(1, "month").startOf("month").format("X");
        endDate = moment().subtract(1, "month").endOf("month").format("X");
        this.setState({
          selectedEndDate: moment(endDate * 1000).local(),
          selectedStartDate: moment(startDate * 1000).local(),
        });
      } else {
        endDate = endDateRelative;
        startDate = 1519560230;
        this.setState({
          selectedStartDate: moment(startDate * 1000).local(),
        });
      }
    }
    console.log(startDate, endDate);
    this.props.onChange(startDate, endDate);
  }

  render = () => {
    let onSelect = this.props.onSelect;
    let {selectedStartDate} = this.state

    if (typeof onSelect !== "function") onSelect = () => {};

    let startDate = moment(1519560230 * 1000).local();
    let showDate = startDate
    if (selectedStartDate) {
      showDate = selectedStartDate
    }
    else if (this.props.startDate) {
      showDate = moment(this.props.startDate * 1000).local();
    }
    return (
      <div className="datepicker-container">
        <div className="date-dropdown">
          <div
            className="date-selector date-selector--init"
            onClick={() => this.handleDateOnClick("init")}
          >
            <div className="icon icon--calendar" />
            <p className="r">{this.formatDateToReadableText(showDate)}</p>
            <div className="down-arrow" />
          </div>
          <div
            className={`dropdown ${
              this.state.open == "init" ? "is-active" : ""
            }`}
          >
            {this.renderDatesDropdown("init")}
          </div>
        </div>
        <p className="r">-</p>
        <div className="date-dropdown">
          <div
            className="date-selector date-selector--end"
            onClick={(e) => this.handleDateOnClick("end")}
          >
            <div className="icon icon--calendar" />
            <p className="r">
              {this.formatDateToReadableText(this.state.selectedEndDate)}
            </p>
            <div className="down-arrow" />
          </div>
          <div
            className={`dropdown ${
              this.state.open == "end" ? "is-active" : ""
            }`}
          >
            {this.renderDatesDropdown("end")}
          </div>
        </div>
      </div>
    );
  };
}

export default CalendarPicker;
