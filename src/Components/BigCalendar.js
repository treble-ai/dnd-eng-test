import React from "react";
import moment from "moment";
import { range } from "moment-range";
import "./BigCalendar.scss";

let weekdayshort = moment.weekdays();
export default class BigCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCalendarTable: true,
            dateObject: moment(),
            allmonths: moment.months(),
            selectedDay: moment().format("D")
        };
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
        let firstDay = moment(dateObject)
        .startOf("month")
        .format("d"); 
        return firstDay;
    };
    month = () => {
        return this.state.dateObject.format("MMMM");
    };

    onPrev = () => {
        
        this.setState({
        dateObject: this.state.dateObject.subtract(1, "month")
        });
        this.props.onMonthChange(this.state.dateObject)
    };
    onNext = () => {

        this.setState({
        dateObject: this.state.dateObject.add(1, "month")
        });
        this.props.onMonthChange(this.state.dateObject)
    };

    renderChildren(d, month, year){
        if(this.props.renderChildren){
            return this.props.renderChildren(d, month, year)
        }
        return null
    }

    renderDate(day){
        return(
            <div className = 'day-container'>
                <div className = 'day'>
                    {day}
                </div>
            </div>
        )   
    }


    render() {

        let dateObject = Object.assign({}, this.state.dateObject);
        let lastMonthDay = moment(dateObject).subtract(1, 'month').daysInMonth()
        let firstDisplayDay = lastMonthDay - this.firstDayOfMonth() + 1
        let lastMonthInactiveDays = []
        for (let i = 0; i<this.firstDayOfMonth(); i++){
            lastMonthInactiveDays[i] = firstDisplayDay
            firstDisplayDay += 1
        }
        let weekday = weekdayshort.map(day => {
            return <th key={day}>{day}</th>;
        });
        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(
                <td className="calendar-day empty">
                    {this.renderDate(lastMonthInactiveDays[i])}
                    {this.renderChildren(lastMonthInactiveDays[i], 
                        moment(dateObject).subtract(1, 'month').format("MMMM"),
                        moment(dateObject).subtract(1, 'month').format("YYYY"))
                    }
                </td>
            );
        }
        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let currentDay = ''
            if(d == this.state.selectedDay && this.month() == moment().format("MMMM")){
                currentDay = "today"
            }
            daysInMonth.push(
                <td key={d} className={`calendar-day ${currentDay}`}>
                {this.renderDate(d)}
                {this.renderChildren(d, this.month(), moment(dateObject).format('YYYY'))}
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
        if (rows[0].length ==0){
            rows = rows.slice(1)
        }
        if(rows[rows.length - 1].length !== 7){
            let lastRow = rows[rows.length - 1]
            let firstDay = 1
            for(let i = lastRow.length; i <7; i++){
                lastRow.push(
                    <td className="calendar-day empty">
                        {this.renderDate(firstDay)}
                        {this.renderChildren(firstDay, 
                            moment(dateObject).add(1, 'month').format("MMMM"),
                            moment(dateObject).format('YYYY'))}
                    </td>
                )
                firstDay += 1
            }
        }

        let daysinmonth = rows.map((d, i) => {
        return <tr>{d}</tr>;
        });

        return (
            <div className="datetime-big-calendar">
                <div className = 'calendar-date-container'>
                    <h5>{this.month() + " " + this.year()}</h5>
                    <div className = 'flush-right-container'>
                        <span
                            onClick={e => {
                            this.onPrev();
                            }}
                            class="button-prev"
                        />
                        <span
                            onClick={e => {
                            this.onNext();
                            }}
                            className="button-next"
                        />
                    </div>
                </div>
                {this.state.showCalendarTable && (
                <div className="calendar-date">
                    <table className="calendar-day">
                    <thead>
                        <tr>{weekday}</tr>
                    </thead>
                    <tbody>{daysinmonth}</tbody>
                    </table>
                </div>
                )}
            </div>
        );
    }
}