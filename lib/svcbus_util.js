'use strict';

var events = require('events');
var util   = require('util');
var azure  = require('azure');

// This utility class contains functions for invoking Azure Service Bus.
// Chris Joakim, Microsoft, 2017/03/23
// Wangshui Wei, Macys Technology, Code Review, Clean up, 

class SvcBusUtil extends events.EventEmitter {

  constructor() {
    super();
    this.namespace   = process.env.AZURE_SERVICEBUS_NAMESPACE; 
    this.queue_name  = process.env.AZURE_SERVICEBUS_QUEUE; 
    this.key_name    = process.env.AZURE_SERVICEBUS_KEY_NAME; 
    this.key_value   = process.env.AZURE_SERVICEBUS_ACCESS_KEY;

    // Build the connection string manually.
    this.conn_string = 'Endpoint=sb://' + this.namespace + '.servicebus.windows.net/';
    this.conn_string = this.conn_string + ';SharedAccessKeyName=' + this.key_name;
    this.conn_string = this.conn_string + ';SharedAccessKey=' + this.key_value;

    if (true) {
      
      console.log('SvcBusUtil constructor namespace:   ' + this.namespace);
      console.log('SvcBusUtil constructor queue_name:  ' + this.queue_name);
      console.log('SvcBusUtil constructor key_name:    ' + this.key_name);
      console.log('SvcBusUtil constructor key_value:   ' + this.key_value.substring(0, 10) + '...');
      console.log('SvcBusUtil constructor conn_string: ' + this.conn_string.substring(0, 130) + '...');
    }

    //Create handle to Integration Service Bus
    this.service = azure.createServiceBusService(this.conn_string);

 
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

  send_message_to_queue(msg, override_qname) {
    var q = this.get_queue_name(override_qname);
     console.log('Inside send message to queue:   ' + q);

    this.service.sendQueueMessage(q, msg, (error) => {
      var evt_obj = {};
      evt_obj['type']    = 'send_message_to_queue';
      evt_obj['queue']   = q;
      evt_obj['message'] = msg;
      evt_obj['error']   = error;
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
    return this.queue_name;
  }
}

module.exports.SvcBusUtil = SvcBusUtil;
