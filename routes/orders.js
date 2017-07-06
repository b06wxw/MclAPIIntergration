// Chris Joakim, Microsoft, 2017/03/31

const express = require('express');
const router  = express.Router();

//Internal libs in this project
const SvcBusUtil = require('../lib/svcbus_util.js').SvcBusUtil;
const AppLogger  = require('../lib/app_logger.js').AppLogger;
// Put here , so this will be invoked at server start up time


var logger_util = new AppLogger();


router.post('/collect', function(req, res) {
    var svcbus_util = new SvcBusUtil();
  //  var logger_util = new AppLogger();
    var override_qname = undefined;
    var body = req.body;
    var jstr = JSON.stringify(body);


    console.log('post /orders/collect body: ' + body);
    console.log('post /orders/collect jstr: ' + jstr);
    
    svcbus_util.on('done', function(evt_obj) {
      console.log(evt_obj);
      if (evt_obj['error']) {
        res.status(400);
        return res.send({received: false});
      }
      else {
        return res.json({received: true, body: body});
      }
    });
    svcbus_util.send_message_to_queue(jstr, 'orderscollect');
});

/**
 * Wangshui Wei, 
 *  This is the method which will be used to write order status update JSON body
 *  to Azure Service Bus
 *   The JSON body has been loggied via APIM, the method here is more focus on catching
 *   and logging exceptions
 *   Also, there should not be any different logging to console, 
 *   The log detail (inlcude log destination) should be abstracted behind AppLogger
 **/

router.post('/update', function(req, res) {
 
    var override_qname = undefined;
    var body = req.body;
    var jstr = JSON.stringify(body);



     logger_util.log(logger_util.log_info, jstr);
    
    var svcbus_util = new SvcBusUtil();
    svcbus_util.on('done', function(evt_obj) {
      if (evt_obj['error']) {
        //Need to log the error  
        logger_util.log(logger_util.log_error, jstr);
        res.status(400);
        return res.send({received: false});
      }
      else {
        return res.json({received: true, body: body});
      }
    });
    // Wangshui Wei, use the default in servicetuil which is configured via enviorment valirable
    //or app setting, this needs to be improved
    svcbus_util.send_message_to_queue(jstr, '');
});

module.exports = router;
