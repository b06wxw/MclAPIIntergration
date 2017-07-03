'use strict';

var events = require('events');
var util   = require('util');
var azure  = require('azure');
var AppLogger  = require('../lib/app_logger.js');


 var namespace   = process.env.AZURE_SERVICEBUS_NAMESPACE; 
 var queue_name  = process.env.AZURE_SERVICEBUS_QUEUE; 
 var key_name    = process.env.AZURE_SERVICEBUS_KEY_NAME; 
 var key_value   = process.env.AZURE_SERVICEBUS_ACCESS_KEY;
   // Build the connection string manually.
 var conn_string = 'Endpoint=sb://' + namespace + '.servicebus.windows.net/';
 var conn_string = conn_string + ';SharedAccessKeyName=' + key_name;
 var conn_string = conn_string + ';SharedAccessKey=' + key_value;
    
  
 //console out put , only at server loading time     
 console.log('SvcBusUtil package loading:   ' + namespace);
 console.log('SvcBusUtil package loading:  ' + queue_name);
 console.log('SvcBusUtil package loading:    ' + key_name);
 console.log('SvcBusUtil package loading:   ' + key_value.substring(0, 10) + '...');
 console.log('SvcBusUtil package loading: ' + conn_string.substring(0, 130) + '...');

// This utility class contains functions for invoking Azure Service Bus.
// Chris Joakim, Microsoft, 2017/03/23
// Wangshui Wei, Macys Technology, Code Review, Clean up, 

class SvcBusUtil extends events.EventEmitter {

  constructor() {
    super();
    this.service = azure.createServiceBusService(conn_string);
    console.log('SvcBusUtil Constrcutor:   ' );
  }
 
  list_queues() {
    var opts = {};
    this.service.listQueues(opts, (error, list) => {
      var evt_obj = {};
      evt_obj['type']  = 'list_queues';
      evt_obj['error'] = error;
      evt_obj['list']  = list;
      this.emit('done', evt_obj);
    });
  }

  get_queue_info(override_qname) {
    var q = this.get_queue_name(override_qname);
    this.service.getQueue(q, (error, queue) => {
      var evt_obj = {};
      evt_obj['type']  = 'get_queue_info';
      evt_obj['error'] = error;
      evt_obj['queue'] = queue;
      this.emit('done', evt_obj);
    });
  }

  // This is the method whihc called by update in orders.js
  send_message_to_queue(msg, override_qname) {
    var q = this.get_queue_name(override_qname);
     //Create handle to Integration Service Bus
   
     console.log('Inside send message to queue:   ' + q);

    this.service.sendQueueMessage(q, msg, (error) => {
      var evt_obj = {};
      evt_obj['type']    = 'send_message_to_queue';
      evt_obj['queue']   = q;
      evt_obj['message'] = msg;
      evt_obj['error']   = error;
      // create events to evoke called back in the caller
      this.emit('done', evt_obj);
    });
  }

  read_message_from_queue(override_qname) {
    var q = this.get_queue_name(override_qname);
    var opts = { isPeekLock: false, timeoutIntervalInS: 3 };
    this.service.receiveQueueMessage(q, opts, (error, msg) => {
      var evt_obj = {};
      evt_obj['type']    = 'read_message_from_queue';
      evt_obj['queue']   = q;
      evt_obj['message'] = msg;
      evt_obj['error']   = error;
      this.emit('done', evt_obj);
    });
  }

  create_queue(override_qname) {
    var q = this.get_queue_name(override_qname);
    this.service.createQueueIfNotExists(q, (error) => {
      var evt_obj = {};
      evt_obj['type']  = 'create_queue';
      evt_obj['qname'] = q;
      evt_obj['error'] = error;
      this.emit('done', evt_obj);
    });
  }

  get_queue_name(override_qname) {
    if (typeof override_qname != 'undefined' && override_qname) {
      if (override_qname.length > 1) {
        return override_qname;
      }
    }
    return queue_name;
  }
}

module.exports.SvcBusUtil = SvcBusUtil;
