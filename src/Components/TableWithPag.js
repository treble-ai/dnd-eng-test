import React from "react";
import Table from "react-bootstrap/Table";
import events from "utils/events";

const PAGESIZE = 10;
const MAXPAGE = 5;

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
        pages: [],
      },
      pageItems: [],
      items: [],
    };
  }
  /**
 * setPage generates the pager acording to the items given 
 by props.
 * @param  {int} page the current page to be display
 */

  setPage(page, track = false) {
    if (this.props.eventPrefix && track) {
      events.track(this.props.eventPrefix + "pagination", { page: page });
    }

    let { items, pagesize } = this.props;
    let pager = this.state.pager;
    if (page < 1) {
      return;
    }

    pager = this.getPager(items.length, page, 6);

    let pageItems = items.slice(pager.startIndex, pager.endIndex + 1);

    this.props.onChangePage(pageItems);

    this.setState({ pager: pager, pageItems: pageItems });
  }

  //static getDerivedStateFromProps(nextProps, prevState){
  //  if(prevState.items != nextProps.items){
  //      return {items: nextProps.items}
  //  }
  // }
  /**
 * componentDidUpdate updates the component when the items
 given by props have changed.
 * @param  {obj} prevProps props in the last state
 * @param  {obj} prevState previus state
 */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.items != this.props.items) {
      this.setPage(1);
    }
    if (prevState.pageItems.length == 0 && this.props.items.length > 0) {
      this.setPage(1);
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

    const MIDDLEPAGE = Math.ceil(MAXPAGE / 2);

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
        endPage = currentPage + MIDDLEPAGE - 1;
      }
    }

    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    var pages = [...Array(endPage + 1 - startPage).keys()].map(
      (i) => startPage + i
    );

    return {
      totalItems: totalItems,
      currentPage: currentPage,
      totalPages: totalPages,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }

  renderPagination = (pager) => {
    let totalPages = pager.totalPages;
    if (totalPages < 2) {
      return null;
    } else {
      return (
        <ul className="pagination">
          <li className={`arrows ${pager.currentPage === 1 ? "inactive" : ""}`}>
            <a onClick={() => this.setPage(pager.currentPage - 1, true)}>❮</a>
          </li>

          {pager.pages.map((page, index) => (
            <li
              key={index}
              className={pager.currentPage === page ? "active" : ""}
            >
              <a onClick={() => this.setPage(page, true)}>{page}</a>
            </li>
          ))}
          <li
            className={`arrows ${
              pager.currentPage === pager.totalPages ? "inactive" : ""
            }`}
          >
            <a onClick={() => this.setPage(pager.currentPage + 1, true)}>❯</a>
          </li>
        </ul>
      );
    }
  };

  render() {
    let pager = this.state.pager;
    return <div>{this.renderPagination(pager)}</div>;
  }
}

class TablePagination extends React.Component {
  // props:
  // headers list[str]
  // data list[obj] filtered
  // attributes list[str]
  // hasPagination bool
  // onChangePage func

  constructor(props) {
    super(props);
    this.state = {
      pageItems: this.props.data,
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
  };
  /**
   * displayPagination props: has pagination for true or false value
   * @return {obj} pagination component
   */

  displayPagination = (pagination) => {
    if (this.props.hasPagination) {
      return (
        <div className="pagination">
          <PaginationForm
            eventPrefix={this.props.eventPrefix}
            items={this.props.data}
            pageSize={PAGESIZE}
            onChangePage={this.onChangePage}
            length={this.props.data.length}
          />
        </div>
      );
    }
  };

  renderTDElement = (user) => {
    return this.props.atributes.map((attr) => {
      return (
        <td
          className={` attribute attribute-${attr}`}
          key={`${Math.random() * 1000}`}
        >
          {" "}
          {this.props.displayCell(user, attr)}
        </td>
      );
    });
  };

  renderTHElement = (head) => {
    return this.props.displayHeader(head);
  };
  renderElements(data) {
    if (data.length != 0) {
      return (
        <tbody>
          {data.map((user) => {
            return (
              <tr key={`${Math.random() * 1000}`}>
                {this.renderTDElement(user)}
              </tr>
            );
          })}
        </tbody>
      );
    }
  }

  renderNoData(data) {
    if (
      data.length == 0 &&
      typeof this.props.renderNoDataContainer == "function"
    ) {
      return this.props.renderNoDataContainer();
    }
  }

  renderTable = () => {
    let data = this.props.data;
    if (this.props.hasPagination) {
      data = this.state.pageItems;
    }
    return (
      <div>
        <Table responsive>
          <thead>
            <tr>
              {this.props.headers.map((head) => {
                return (
                  <th
                    key={`header header--${head}`}
                    className={`header-${head}`}
                  >
                    {this.renderTHElement(head)}
                  </th>
                );
              })}
            </tr>
          </thead>
          {this.renderElements(data)}
        </Table>
        {this.renderNoData(data)}
      </div>
    );
  };

  render() {
    return (
      <div className="whole-table">
        <div className="tab">
          {this.renderTable()}
          <div className="pagination-container">{this.displayPagination()}</div>
        </div>
      </div>
    );
  }
}

export default TablePagination;
