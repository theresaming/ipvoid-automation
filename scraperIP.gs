function ipVoidScraper(dstIP)
{
  // scrape on last cell
  //open spreadsheet and fetch url cell
  var myspreadsheet = SpreadsheetApp.openById("spreadsheet_id");
  var sheet = myspreadsheet.getSheets()[0];

  //http://www.ipvoid.com/scan/IPAddress
  var urlString = ("http://www.ipvoid.com/scan/" + dstIP);
  var response = UrlFetchApp.fetch(urlString).getContentText(); //html sitting in response in string

  //need regex test for report not found - needs work
  var notFound = response.match("Report not found");
  if (notFound == "Report not found")
    return "undefined";
  if(notFound != "Report not found") {

    //parse html and set array
    //parse revDNS
    var revDNS = response.match(/Reverse DNS<\/td><td>(.*)<\/td>/);
    revDNS = revDNS[1];
    //parse asnOwn
    var asnOwn = response.match(/ASN Owner<\/td><td>(.*)<\/td>/);
    asnOwn = asnOwn[1];
    //parse ispOwn
    var ispOwn = response.match(/ISP<\/td><td>(.*)<\/td>/);
    ispOwn = ispOwn[1];
    //parse continent
    var continent = response.match(/Continent<\/td><td>[a-zA-Z]{1,500}/);
    continent = continent[0].split(">");
    continent = continent[2];
    //parse countryCode
    var countryCode = response.match(/alt="Flag"\s\/>\s(.*)<\/td>/);
    countryCode = countryCode[1];
    // parse rep
    var rep =  response.match(/("label label-)[a-zA-Z]{1,40}">[A-Z-a-z0-9\/ ]{1,300}/);
    rep = rep[0].split(">");
    rep = rep[1];
    // parse last analyzed
    var last = response.match(/(Analysis Date<\/td><td>)[A-Za-z0-9 ]{0,300}[a-z]/);
    last = last[0].split(">");
    last = last[2];

    ///return content to be written to spreadsheet
    var dataArr = [rep, revDNS, asnOwn, ispOwn, continent, countryCode, last];
    return dataArr;
  }
}
