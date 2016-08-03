# IPVoid Automation
ip reputation checker integrated with google sheets and gmail

### About
this google apps script/javascript allows to perform automated ip repuation checking.
### Usage
so this code has three parts:
    
    Code.gs // this is where all the magic happens
    scraperIP.gs // this is the web scraper + some fun regexes (puts data in google sheet)
    responseLookup.gs // this returns the email with additional information

In order for this to work, all you have to do is...
make a google sheet and grab the [id](https://productforums.google.com/forum/#!topic/docs/nCupsqSo7UY), make relevant changes (see code), and run the [Code.gs](https://script.google.com) file

### Todo
there's still some edge-case errors specific to IPVoid and some gmail error
1. what to do when gmail inbox has no emails
2. what to do when ipvoid doesn't have an ip address
3. what to do when http request is too "fast" 


