function ipvoidResponse(oldBody, msgThread, sub, to, data) {
  //parameter: sub for email, row of data
  var header = ["Source IP","Destination IP","Reputation","Reverse DNS","ASN Owner","ISP","Continent","Country Code","Last Analyzed"];

  //send email
  var body = "IP Address Data:\n";

  for (var j = 0; j < data.length; j++) {
   data[j] = data[j].toString();
  }

  for (var i = 0; i < header.length; i++) {
    Logger.log(data[i]);
    body+= header[i] + ": " + data[i] + '\n';
  }

  body += oldBody;
  GmailApp.sendEmail(to, sub, body, {
    replyTo: "your_email_here"
  });

}
