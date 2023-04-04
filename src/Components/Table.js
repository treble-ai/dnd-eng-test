import React from "react";
import Table from "react-bootstrap/Table";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import styles from "./Table.scss";

import ReactHtmlParser from "react-html-parser";
var showdown = require("showdown");
var converter = new showdown.Converter();

const PAGESIZE = 10;
const MAXPAGE = 10;
const CONTENT = 'content';
const ANSWERS = 'answers';
const NAME = 'name';
const STATUS = 'status';

class PaginationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pager: {
        currentPage: 1,
        pageSize: props.pageSize,
        totalPages: Math.ceil(props.totalItems / props.pageSize),
        startPage: 1,
        endPage: 6,
        startIndex: 0,
        endIndex: Math.min(props.pageSize, props.totalItems - 1),
        pages: []

      },
      pageItems:[],
      items: []
    };
  }
    /**
 * setPage generates the pager acording to the items given 
 by props.
 * @param  {int} page the current page to be display
 */

  setPage(page, track=false) {

    if (this.props.eventPrefix && track) {
      events.track(this.props.eventPrefix + 'pagination', { 'page': page });
    }

    let { items, pagesize } = this.props;
    let pager = this.state.pager;

    if (page < 1) {
      return;
    }

    pager = this.getPager(items.length, page, 6);

    let pageItems = items.slice(pager.startIndex, pager.endIndex + 1);

    this.props.onChangePage(
      pageItems,
    );

    this.setState({ pager: pager , pageItems: pageItems});
    

  };
  static getDerivedStateFromProps(nextProps, prevState){
    if(prevState.items != nextProps.items){
        return {items: nextProps.items}
    }
  }
    /**
 * componentDidUpdate updates the component when the items
 given by props have changed.
 * @param  {obj} prevProps props in the last state
 * @param  {obj} prevState previus state
 */
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.items != this.props.items){
      this.setPage(1)

    }
    if(prevState.pageItems.length == 0 && this.props.items.length > 0){

      this.setPage(1)

    }
  }

/**
 * getPager this function generates the list of pages to be display,
  the index for the current page, and the total pages to be display.
  For example: totalItems = 100, currentPage =  1, pageSize= 10
  return = (totalItems = 100, currentPage = 1, pageSize = 5, 
  totalPages = 20, startIndex = 0, endIndex= 4, pages = [1,2,3,4,5,6,7,8,9,10])
  * @param  {int} totalItems the length of the list
 * @param  {int} currentPage in which page the state is, default 1.
 * @param  {int} pageSize the length of the list of objects
  to be display for the current page
  * @return {int} currentPage the page of the state
  * @return {int} totalPages the number of pages acording to the length
    of the list
  * @return {int} startIndex the index of the first item of the current page
  * @return {int} endIndex the index of the last item of the current page
  * @return {list} pages the list of pages to be display


 */

  getPager(totalItems, currentPage, pageSize) {
    currentPage = currentPage;

    pageSize = PAGESIZE;

    const MIDDLEPAGE = Math.ceil(MAXPAGE / 2)

    var totalPages = Math.ceil(totalItems / pageSize);

    var startPage, endPage;
    if (totalPages <= MAXPAGE) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= MIDDLEPAGE) {
        startPage = 1;
        endPage = MAXPAGE;

      } else if (currentPage + MIDDLEPAGE - 1 >= totalPages) {
        startPage = totalPages - MAXPAGE + 1;
        endPage = totalPages;

      } else {
        startPage = currentPage - MIDDLEPAGE;
        endPage = currentPage + MIDDLEPAGE- 1;
      }
    }

    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    var pages = [...Array(endPage + 1 - startPage).keys()].map(
      i => startPage + i
    );

    return {
      totalItems: totalItems,
      currentPage: currentPage,
      totalPages: totalPages,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  renderPagination = (pager) => {
    let totalPages = pager.totalPages
    if (totalPages < 2){
      return null;
    } else {
      return (
      <ul className="pagination">
        <li className={pager.currentPage === 1 ? "hola" : ""}>
          <a onClick={() => this.setPage(pager.currentPage - 1)}>❮</a>
        </li>
        
        {pager.pages.map((page, index) => (
          <li
            key={index}
            className={pager.currentPage === page ? "active" : ""}
          >
            <a onClick={() => this.setPage(page)}>{page}</a>
          </li>
        ))}
        <li className={pager.currentPage === pager.totalPages ? "hola" : ""}>
          <a onClick={() => this.setPage(pager.currentPage + 1)}>❯</a>
        </li>
      </ul>
        );

    }

  }

  render() {
    let pager = this.state.pager;
    return (
      <div>
      {this.renderPagination(pager)}
      </div>

    );

  }
}

class DatatablePage extends React.Component {
  // props:
  // headers list[str]
  // data list[obj] filtered
  // attributes list[str]
  // hasPagination bool
  // onChangePage func

    constructor(props) {
    super(props);
    this.state = {
      pageItems : this.props.data,
      hoverItem : null
    };
  }

    /**
 * onChangePage updates the state of the table
 * @param  {list} pageItems lis of elements to be display
 */

  onChangePage = (pageItems) => {

    this.setState({

      pageItems: pageItems,
      
    });
  }
    /**
 * displayPagination props: has pagination for true or false value 
  * @return {obj} pagination component
 */

  displayPagination = (pagination) => {
    if (this.props.hasPagination) {
      return (
        <div className="pagination">
          <PaginationForm
            items={this.props.data}
            pageSize={PAGESIZE}
            onChangePage={this.onChangePage}
            length = {this.props.data.length}
          />
        </div>
      );
    }
  };

/**
 * renderTrData
 * @param  {obj} dataElement element to be display
  * @return {<tr>} table row of element 
 */

  renderTRData = dataElement => {


    return (
      <tr>
        {this.props.attributes.map(attr => {
          return this.renderTDData(dataElement, attr);
        })}
      </tr>
    );
  };
    /**
 * renderTDData formats answers as a string with spaces
 * @param  {list} answers cotains all answers
  * @return {str} cointains answers in html string
 */

  formatAnswers = answers => {
    let markdownText = "";
    let count = 1;
    answers.forEach(ans => {
      markdownText += `${count}) `;
      markdownText += ans;
      markdownText += "\n\n";
      count += 1;
    });
    return markdownText;
  };

  renderHeader(hsm){
    if (!hsm.header) return
    let headerType = hsm.header.type
    let display = (headerType == 'text') ? hsm.header.text : hsm.header.url
    return(
      <>
        <br/>
        <h6>Header</h6>
        <br/>
        < div className = 'icon-container'>
          <div className = {`icon--${headerType}`}/>
          <p className="r"> {display}</p>
        </div>
        <br />
      </>
    )
  }

  renderFooter(hsm){
    if (!hsm.footer) return
    return(
      <>
        <br/>
        <h6>Footer</h6>
        <br/>
        <p className="r"> {hsm.footer.text}</p>
        <br />
      </>
    )
  }

  renderButtons(hsm){
    if (!hsm.buttons) return
    let buttonType = hsm.buttons.type
    return(
      <>
        <br/>
        <h6>Buttons</h6>
        <br/>
        {hsm.buttons.options.map(button=>{
          let icon = ''
          if(buttonType == 'call_to_action'){
            icon = (button.url)?'web': 'phone'
          }
          return(
            <div className = 'icon-container'>
              <div className = {`icon--${icon}`}/>
              <p className="r"> {`${button.text} ${(button.url)? '( ' + button.url + ' )' : ''}` }</p>
            </div>
          )
        })}
        <br />
      </>
    )
  }
    /**
 * renderTDData displays tooltip with content 
 * props: displayTootip brings me the display of the dataelement, 
 * if you don't want the value
 * @param  {obj} dataElement element to be display
  * @return {<Tooltip>} in selected elements  
 */
  renderTooltipContent = (dataElement) => {
  let question
  question = dataElement[CONTENT]

  let answers = ''
  if (typeof dataElement[ANSWERS] !== "undefined") {
        answers += this.formatAnswers(dataElement["answers"]);
      }

  answers = ReactHtmlParser(converter.makeHtml(answers))
  if (dataElement.buttons?.type == 'quick_reply'){
    answers = ''
  }

  let status = ''
  if( typeof this.props.displayTooltip === 'function'){
    status = this.props.displayTooltip(dataElement, STATUS)
  }
  return (
    <Tooltip 
        id="button-tooltip" 
        className="hsm-tooltip"
        onMouseEnter={() => this.setState({ hoverItem: dataElement })}
        onMouseLeave={() => this.setState({ hoverItem: null })}
    >
      
      <h6 className="r"> 
        <i className={`icon icon--${status.value}`}></i>
        {status.display}
      </h6>
      {this.renderHeader(dataElement)}
        <h6>Body</h6>
      <br/>
        <p className="r"> {question}</p>
      <br/>
        <p className="r"> {answers}</p>
      <br/>
      {this.renderFooter(dataElement)}
      {this.renderButtons(dataElement)}
    </Tooltip>
  );
  }
  /**
 * renderTDData props: displayAttr is a function that displays 
    an attribute given an element 
 * @param  {obj} dataElement element to be display
 * @param  {string} variable to be display
  * @return {<td>} table row of element 
 */

  showTooltipOnHover(element){
    if(JSON.stringify(this.state.hoverItem) == JSON.stringify(element)){
        return true
    }
    return false
  }

  renderTDData = (dataElement, attribute) => {


    if( typeof this.props.displayAttr === 'function'){

      let attributeStr = this.props.displayAttr(dataElement,attribute)
      if(attribute === CONTENT) {
        return(
            <OverlayTrigger
              placement="right"
              overlay={this.renderTooltipContent(dataElement)}
              show={this.showTooltipOnHover(dataElement)}
                  >
              <td 
                className = 'content'
                onMouseEnter={() => this.setState({ hoverItem: dataElement })}
                onMouseLeave={() => this.setState({ hoverItem: null})}
                > {attributeStr} </td>
            </OverlayTrigger>
            
        )
      } else if (attribute == NAME) {
        return(
          <td className = 'name'> {attributeStr} </td>
        )
      } else {
        return(
          <td className= {`${attribute}`}> {attributeStr} </td>
        )
      }

    }else{

      return <td>{dataElement[attribute]}</td>

    }
  };



  renderTable = () => {
    let data
    if(this.props.hasPagination){
      data = this.state.pageItems
    }else{

      data=this.props.data
    }
    return (
      <div className="table-container">
        <div className="table-of-data">
          <Table responsive borderless size="xl">
            <thead>
              <tr>
                {this.props.headers.map(head => {
                  let displayName = (head == 'button') ? '' : head
                  return <th key={`header-${head}`}>{displayName}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {data.map(dataElement => {
                return this.renderTRData(dataElement);
              })}
            </tbody>
          </Table>
        </div>
        {this.displayPagination()}
      </div>
    );

  };

    render(){

        return (

            <div className="whole-table" styles={styles}>
                <div className="tab">{this.renderTable()}</div>
            </div>
        );
    };
};

export default DatatablePage;
