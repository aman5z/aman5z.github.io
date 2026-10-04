/**
 * Code.gs
 * -------
 * Google Apps Script "Web App" that receives visit pings from
 * visitor-tracker.js and logs them into a Google Sheet, incrementing a
 * Visit Count for returning visitors instead of creating duplicate rows.
 *
 * Setup: see README.md in this folder for full step-by-step instructions.
 */

var SHEET_NAME = 'Portfolio Visitors';
var HEADERS = [
  'Timestamp', 'Last Visit', 'Visitor ID', 'City', 'Region', 'Country',
  'Visit Count', 'Page', 'Referrer', 'User Agent'
];

function doGet(e) {
  var params = (e && e.parameter) || {};
  var sheet = getOrCreateSheet_();

  var visitorId = params.visitorId || 'anon';
  var now = new Date();

  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === visitorId) {
      rowIndex = i + 1; // 1-based sheet row
      break;
    }
  }

  if (rowIndex === -1) {
    sheet.appendRow([
      now,
      now,
      visitorId,
      params.city || '',
      params.region || '',
      params.country || '',
      1,
      params.page || '',
      params.referrer || '',
      params.userAgent || ''
    ]);
  } else {
    var visitCountCol = HEADERS.indexOf('Visit Count') + 1;
    var lastVisitCol = HEADERS.indexOf('Last Visit') + 1;
    var currentCount = sheet.getRange(rowIndex, visitCountCol).getValue() || 0;
    sheet.getRange(rowIndex, lastVisitCol).setValue(now);
    sheet.getRange(rowIndex, visitCountCol).setValue(currentCount + 1);
  }

  // The request is sent as an <img> beacon, so the actual response body
  // is never read by the browser — a simple text response is enough.
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
