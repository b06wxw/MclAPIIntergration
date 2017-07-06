'use strict';

var events = require('events');
var util     = require('util');
var async    = require('async');
var azure    = require('azure');

//var EventHubClient = require('azure-event-hubs').Client;
var request = require('request');
var https = require('https');
var http = require('http');


//log level for this web app, configured via app setting
var APP_LOG_MODE = process.env.AZURE_APP_LOGGER_MODE
var APP_NAME = process.env.APP_NAME;
//HARD coded for testing 
APP_LOG_MODE = 0;
APP_NAME = 'NODE_WEB_APP';


  // prepare the header
  /** 
          var postheaders = {
              'Content-Type' : 'application/json',
              'Ocp-Apim-Subscription-Key' :'b94fff950612424f9b5893c17bd9c7f8',
              'Ocp-Apim-Trace' : 'true'
          };
          */


    var  postheaders = {}; //Emp
    postheaders['Content-Type'] = 'application/json';
    postheaders['Ocp-Apim-Trace'] = process.env.APIM_TRACE;
    postheaders['Ocp-Apim-Subscription-Key'] = process.env.LOG_API_OCP_APIM_KEY;
        
     
          // the post options
          var optionspost = {
              host : 'mclserviceapihub.azure-api.net',
              port : 80,
              path : '/orders/update',
              method : 'POST',
              Json : true,
              headers : postheaders
          };

         
         // optionspost[0].host = process.env.API_LOGGING_HOST;
          optionspost['host'] =  process.env.API_LOGGING_HOST;
          optionspost['port'] = process.env.API_LOGGING_PORT;
          optionspost['path'] = process.env.API_LOGGING_URL_PATH;
        




// Logger class that writes several outputs - console, EventHubs, Application Insights, etc
// Chris Joakim, Microsoft, 2017/06/28
//Wangshui Wei, Macys Technology, 2017/06/29 
// Adding comments and Change Name of Event Hub.. 
//Adding log level to allow logger configuration via app setting


class AppLogger extends events.EventEmitter {

    constructor() {
    super();
    console.log('Loading, inside Applogger Constructor');
    this.log_trace = 1;
    this.log_info =  2;
    this.log_debug = 3;
  
    this.log_warn = 4;
    this.log_error = 5;
    this.log_fatal = 6;



  }
    

  
    
    
   log(logLevel, msg) {
        
        // This method writes the log message to Console AND event_hub for 
        if(APP_LOG_MODE <= logLevel) {
           //If requested log level is higher than configured app_log_mode
           console.log('loglevel: '+ logLevel + ' app logMode is: ' + APP_LOG_MODE);
           console.log(msg);

          //If the level is worse that debug (Warning, error, fatal, need to log  to EventHub
          if (this.log_debug < logLevel) {
           var logmsg = '{"LogLevel" :' + '"' + logLevel + '", "MessageBody" : ' + msg + ' }';
           console.log( 'Log to event hub the following, Json body is :' + logmsg);
           this.setToEventHub( logmsg);
          }

        }
   } //End of log fuction

    setToEventHub( msg){
         
        
            // do the POST call
            var reqPost = http.request(optionspost, function(res) {
                // This is the call back
                console.log('POSTed TO event Hub log API completed with status code ' + res.statusCode);
            });

            reqPost.on('error', function(e) {
              console.error('problem with request: ' + e.message);
          });
      
          console.log(this.log_info,'body string is ' + msg);
      
          reqPost.write(msg);
          reqPost.end(); 
   } //end of send To eventHub

}

module.exports.AppLogger = AppLogger;
