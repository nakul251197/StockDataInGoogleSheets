function getSymbolList() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.DEFAULT_SHEET);
    var symbolList = getByName(sheet, config.SYMBOL_COLUMN_NAME);
    return symbolList;
}

function getByName(sheet, colName) {
    var data = sheet.getDataRange().getValues();
    var col = Math.trunc(data[0].indexOf(colName));
    if (col != -1) {
      return getColumn(data, col);
    } 
}

function getColumn(data, col) {
    var column = data.map(function(value, index) {
        return value[col];
    });
    column.shift();
    return column;
}

function createAndUpdateSheet(spreadSheet, symbol) {
    spreadSheet.insertSheet(symbol);
    var sheet = spreadSheet.getSheetByName(symbol);
    var cell = sheet.getRange("A1");
    cell.setFormula(`=GOOGLEFINANCE("${symbol}","all", "${config.START_DATE}", TODAY())`);
}

function updateSheet(spreadSheet, symbol) {
    var sheet = spreadSheet.getSheetByName(symbol);
    if(sheet == null ) return 'Sheet not available';
    else {
        var lastRow = sheet.getLastRow();
        var cell = sheet.getRange(`A${lastRow + 1}`);
        cell.setFormula(`=GOOGLEFINANCE("${symbol}","all", "30/07/2020")`);
        Utilities.sleep(3000);
        SpreadsheetApp.flush();
        deleteHeaders(sheet, lastRow);
    }
}

function deleteHeaders(sheet, lastRow) {
    var data = sheet.getDataRange().getValues();
    Logger.log(lastRow);
    var recentData = data[lastRow + 1];
    Logger.log(recentData);
    if(recentData == undefined) {
        Logger.log('Something went wrong');
    } else {
        sheet.deleteRow(lastRow +1);
        addArrayToSheetColumn(sheet, "A", recentData, lastRow );
    }
}

function addArrayToSheetColumn(sheet, column, values, row) {
    const range = [column, `${row}:`, String.fromCharCode(column.charCodeAt(0)+values.length -1), `${row}`].join("");
    Logger.log(range);
    Logger.log(values);
    const fn = function(v) {
      return [ v ];
    };
    var vals = values.map(fn);
    Logger.log(vals);
    sheet.getRange(row+1, 1, 1, values.length).setValues([values]);
  }