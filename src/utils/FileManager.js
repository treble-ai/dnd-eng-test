import $ from "jquery";

export default {
  loadFromURL: (url, cb_success, cb_error, type, filename) => {
    $.ajax({
      url,
      xhrFields: {
        responseType: "blob",
      },
      success: (data) => {
        let file = new File([data], filename, { type: type });
        cb_success(file);
      },
      error: cb_error,
    });
  },
  /**
   * Download the body of a CSV matrix
   *
   * @param {Array} header csv header
   * @param {[Array]} body csv data in rows
   * @param {String} name name of the download file
   */
  downloadCsvContent: (header, body, filename = "treble") => {
    let rows = [header].concat(body);

    var processRow = function (row) {
      var finalVal = "";
      for (var j = 0; j < row.length; j++) {
        var innerValue = row[j] === null ? "" : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ",";
        finalVal += result;
      }
      return finalVal + "\n";
    };

    var csvFile = "";
    for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }
    csvFile = csvFile.slice(0, -1)
    
    var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `CSV ${filename}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  },
};
