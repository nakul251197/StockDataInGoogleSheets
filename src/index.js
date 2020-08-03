function main() {
    var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    var symbolList = getSymbolList();
    if(symbolList.length == 0) {
        Logger.log('No Symbols in list!');
    } else {
        for(var i = 0; i< symbolList.length; i++ ) {
            if(spreadSheet.getSheetByName(symbolList[i]) == null) {
                createAndUpdateSheet(spreadSheet, symbolList[i]);
            } else {
                updateSheet(spreadSheet, symbolList[i]);
            }
        }
    }
}