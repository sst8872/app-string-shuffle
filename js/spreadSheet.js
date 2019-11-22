function getSheetLength(cb) {
    let appURL = 'https://script.google.com/macros/s/AKfycbzPEv6fWhImZlfEBeuc15Zaq1RapOO_FmtT8_N7bWLiiN_SOoE/exec';
    fetch(appURL)
        .then(res => res.json())
        .then(cb)
        .catch(e => console.log(e));
};

export default getSheetLength;



// function doGet() {
//
//     var ss = SpreadsheetApp.getActiveSpreadsheet();
//     var sheetLen = ss.getSheets().length;
//     var jsonData = JSON.stringify(sheetLen);
//
//     return ContentService.createTextOutput(jsonData).setMimeType(ContentService.MimeType.JSON);
// }
