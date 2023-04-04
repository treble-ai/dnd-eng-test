import React, { Component } from 'react';
import $ from 'jquery'


class LineChart extends Component {
  /*
    props: 
      columns = [
        field: String, // column name
        type: String,  // type could be: number,string
        template: function(row), // row is an object, template returns the html data to be rendered
      ]
      data = [
        Object // item representing the data, each key should match a column 'field'
      ]


    Example: 

  */



  constructor () {
    super();
    this.state = {
    }
  }

  componentDidMount() {
    const script = document.createElement("script");

    script.src = "https://use.typekit.net/foobar.js";
    script.async = false;

    document.body.appendChild(script);
    
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'm_morris_1',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [{
                y: '2006',
                a: 100,
                b: 90
            },
            {
                y: '2007',
                a: 75,
                b: 65
            },
            {
                y: '2008',
                a: 50,
                b: 40
            },
            {
                y: '2009',
                a: 75,
                b: 65
            },
            {
                y: '2010',
                a: 50,
                b: 40
            },
            {
                y: '2011',
                a: 75,
                b: 65
            },
            {
                y: '2012',
                a: 100,
                b: 90
            }
        ],
        // The name of the data record attribute that contains x-values.
        xkey: 'y',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['a', 'b'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Values A', 'Values B']
    });
    

  }



  render() {

    return (
      <div>        
        <div id="m_morris_1"></div>
      </div>
      );
    }
}

export default LineChart;