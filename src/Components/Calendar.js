import React from "react";
import moment from "moment";
import { range } from "moment-range";
import "./Calendar.scss";

let weekdayshort = moment.weekdaysShort();
export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCalendarTable: true,
      dateObject: moment().local(),
      allmonths: moment.months(),
      selectedDay: moment().local().format("D"),
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.date.format() !== this.state.dateObject.format()) {
      this.setState({
        dateObject: nextProps.date,
        selectedDay: nextProps.date.format("D"),
      });
    }
  }
  daysInMonth = () => {
    return this.state.dateObject.daysInMonth();
  };
  year = () => {
    return this.state.dateObject.format("Y");
  };
  currentDay = () => {
    return this.state.dateObject.format("D");
  };
  firstDayOfMonth = () => {
    let dateObject = this.state.dateObject;
    let firstDay = moment(dateObject).startOf("month").format("d");
    return firstDay;
  };
  month = () => {
    return this.state.dateObject.format("MMMM");
  };

  getOnMonthChangeDay = () => {
    if (this.month() == moment().format("MMMM")) {
      return moment().format("D");
    }
    return null;
  };
  onPrev = () => {
    this.setState({
      dateObject: this.state.dateObject.subtract(1, "month"),
      selectedDay: this.getOnMonthChangeDay(),
    });
  };
  onNext = () => {
    this.setState({
      dateObject: this.state.dateObject.add(1, "month"),
      selectedDay: this.getOnMonthChangeDay(),
    });
  };

  onDayClick = (e, day) => {
    let month = this.state.dateObject.format("M");
    let year = this.state.dateObject.format("Y");

    let date = month + "-" + day + "-" + year;

    this.setState({
      selectedDay: day,
    });
    this.props.onSelect(moment(date), this.props.type);
  };
  renderDayContainer(day) {
    return <div className="day-container">{day}</div>;
  }

  render() {
    let dateObject = Object.assign({}, this.state.dateObject);
    let lastMonthDay = moment(dateObject).subtract(1, "month").daysInMonth();
    let firstDisplayDay = lastMonthDay - this.firstDayOfMonth() + 1;
    let lastMonthInactiveDays = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      lastMonthInactiveDays[i] = firstDisplayDay;
      firstDisplayDay += 1;
    }
    let weekdayshortname = weekdayshort.map((day) => {
      return (
        <th key={day}>
          {day.substring(
            0,
            this.props.dayOfWeekLength ? this.props.dayOfWeekLength : 2
          )}
        </th>
      );
    });
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(
        <td className="calendar-day empty" key={lastMonthInactiveDays[i]}>
          {this.renderDayContainer(lastMonthInactiveDays[i])}
        </td>
      );
    }
    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let currentDay = "";
      if (
        d == this.state.selectedDay &&
        this.month() == moment().format("MMMM")
      ) {
        currentDay = "today";
      } else if (
        d == this.state.selectedDay &&
        this.state.selectedDay !== moment().format("D")
      ) {
        currentDay = "today";
      }
      daysInMonth.push(
        <td key={d} className={`calendar-day ${currentDay}`}>
          <span
            onClick={(e) => {
              this.onDayClick(e, d);
            }}
          >
            {this.renderDayContainer(d)}
          </span>
        </td>
      );
    }
    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        // let insertRow = cells.slice();
        rows.push(cells);
      }
    });
    if (rows[0].length == 0) {
      rows = rows.slice(1);
    }
    if (rows[rows.length - 1].length !== 7) {
      let lastRow = rows[rows.length - 1];
      let firstDay = 1;
      for (let i = lastRow.length; i < 7; i++) {
        lastRow.push(
          <td className="calendar-day empty" key={`empty-${i}`}>
            {this.renderDayContainer(firstDay)}
          </td>
        );
        firstDay += 1;
      }
    }

    let daysinmonth = rows.map((d, i) => {
      return <tr key={`days-month-${d}-${i}`}>{d}</tr>;
    });

    return (
      <div className="tail-datetime-calendar">
        <div className="calendar-navi">
          <span
            onClick={(e) => {
              this.onPrev();
            }}
            className="button-prev"
          />
          <span className="calendar-label">
            {`${
              this.props.monthDisplay == "complete"
                ? this.month()
                : this.month().substring(0, 3)
            } ${this.year()}`}
          </span>
          <span
            onClick={(e) => {
              this.onNext();
            }}
            className="button-next"
          />
        </div>
        {this.state.showCalendarTable && (
          <div className="calendar-date">
            <table className="calendar-day">
              <thead>
                <tr>{weekdayshortname}</tr>
              </thead>
              <tbody>{daysinmonth}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}
