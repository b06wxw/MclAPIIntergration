'use strict';

var events = require('events');
var util     = require('util');
var async    = require('async');
var azure    = require('azure');

var EventHubClient = require('azure-event-hubs').Client;

// Logger class that writes several outputs - console, EventHubs, Application Insights, etc
// Chris Joakim, Microsoft, 2017/06/28
//Wangshui Wei, Macys Technology, 2017/06/29  Adding comments and Change Name of Event Hub.. 


class AppLogger extends events.EventEmitter {

    constructor() {
        super();
        // The event hub need to match the destination of APIM logger
        //  We want all logging to go to one place

        //This is the name space, similar to service bus instance
        this.namespace = process.env.AZURE_APP_LOGGER_EVENTHUB_NAMESPACE;

        //this is the event hub itself, simiar to a topic 
        this.hub_name  = process.env.AZURE_APP_LOGGER_EVENTHUB_HUBNAME; 

        // One of the SAS security policy
        this.key_name  = process.env.AZURE_APP_LOGGER_EVENTHUB_POLICY; 
        // The key to be used for the policy
        this.key_value = process.env.AZURE_APP_LOGGER_EVENTHUB_KEY;

        // Build the connection string manually:
        this.conn_string = 'Endpoint=sb://' + this.namespace + '.servicebus.windows.net/';
        this.conn_string = this.conn_string + ';SharedAccessKeyName=' + this.key_name;
        this.conn_string = this.conn_string + ';SharedAccessKey=' + this.key_value;

        //Need to find a way to turn it off via app configuration  
        if (true) {
            console.log('AppLogger constructor eventhub namespace:   ' + this.namespace);
            console.log('AppLogger constructor eventhub hub_name:    ' + this.hub_name);
            console.log('AppLogger constructor eventhub key_name:    ' + this.key_name);
            console.log('AppLogger constructor eventhub key_value:   ' + this.key_value.substring(0, 10) + '...');
            console.log('AppLogger constructor eventhub conn_string: ' + this.conn_string.substring(0, 130) + '...');
        }

        this.eh_client = EventHubClient.fromConnectionString(this.conn_string, this.hub_name);
        this.eh_sender = undefined;
        this.eh_client.createSender().then((tx) => {
            this.eh_sender = tx;
            console.log('eh_sender created: ' + tx);
        });
    }
    
    debug(msg) {
        // This method writes the log message to ONLY the 
        // built-in Node.js console object.
        var jstr = JSON.stringify(msg);
        console.log('EvtHubLogger.debug: ' + jstr);
    }

    log(msg) {
        // This method writes the log message to BOTH the 
        // built-in Node.js console object, as well as to the EventHub.
        // This method can be extended to write to any location(s) you wish.
        var jstr = JSON.stringify(msg);
        console.log('EvtHubLogger.log: ' + jstr);
        this.eh_sender.send(jstr);
    }

}

module.exports.AppLogger = AppLogger;
