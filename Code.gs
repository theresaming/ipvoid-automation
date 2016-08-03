function doGet()
{
  //prime the spreadsheet and email thread
  var myspreadsheet = SpreadsheetApp.openById("spreadsheet_ID");
  var sheet = myspreadsheet.getSheets()[0];
  var threads = GmailApp.getUserLabelByName("folder_name").getThreads(); //gets ALL threads, returns an array of threads

  // check if no unread

  //reads messages in each thread
  for(var i = 0; i < threads.length; i++) {
    if (threads[i].isUnread()) {  //check if thread has any unread messages

      var msg = threads[i].getMessages(); // array of gmail messages

      //reads each message in a thread
      for (var j = 0; j < msg.length; j++) {
        //check for unread messages in thread
        if (msg[j].isUnread()) {
          var from = msg[j].getFrom();
          var body = msg[j].getPlainBody();
          var sub = msg[j].getSubject();
          var to = msg[j].getTo();

          if (from == "from") { //change this as necessary
            //parse email text for source and dest ip
            var findSrc = body.match(/host (?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/).toString().split(" ");
            var findDst = body.match(/to (?:(?:25[0-5]|2[0-4][0-9]Usage|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/).toString().split(" ");
            var srcIP = findSrc[1];
            var dstIP = findDst[1];

            //We've already pulled the src and dest, now check if we've already searched this dest from running list
            var check = onSearch(dstIP, sheet); //rows or -1

            //if no - run scraperIP, append data to spreadsheet, email trigger from scraperIP
            if (check == -1) { // if not in the table
              // add to the table, append data to spreadsheet
              var voidData = ipVoidScraper(dstIP); // array of info
              var fullRow = [srcIP,dstIP].concat(voidData);
              sheet.appendRow(fullRow);
              ipvoidResponse(body, threads[i], sub, to, fullRow);
              threads[i].markRead();
            }
            else { //if ip exists
              //grab that row that has that src and dest IP address
              ipvoidResponse(body, threads[i], sub, to, check);
              threads[i].markRead();
            }
          }
        }
      }
    }
  }
  // put refresh here
  refresh(sheet);
}

function refresh(sheetd) {
  //every 24 hours
  //refresh all the calls to the website
  var destIPs = sheetd.getRange(1, 2, sheetd.getLastRow()).getValues(); //1st is header row  (row, columns, numRows) - returns Object[][] gets dest IPs
  for (var i in destIPs) {
    var ind = parseInt(i);
    if (ind > 0) {
      var v = destIPs[i][0];
      if ((data = ipVoidScraper(v)) != -1) { //grab data from ipvoid
        data = [data];
        var rowNum = ind + 1;
        sheetd.getRange(rowNum,3,1,7).setValues(data);
      }
    }
  }
}

//ip matching in spreadsheet
function onSearch(destIP, sheetd) {
  var ind = -1;
  var columnValues = sheetd.getRange(1, 2, sheetd.getLastRow()).getValues(); //1st is header row  (row, columns, numRows) - returns Object[][]
  for (var i in columnValues) {
    var v=columnValues[i][0]; //puts in columns not rows, ARRAY INDICES 012345
    if (v == destIP) {
      i = parseInt(i);
      var ind = i;
      var rowValues = sheetd.getRange(ind+1,1,1,colNum).getValues();
      if (rowValues.length == 1)
        rowValues = rowValues[0];
      return rowValues;
    }
  }
  return -1;
}
