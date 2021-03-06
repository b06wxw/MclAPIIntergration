// Chris Joakim, Microsoft, 2017/03/31

const express = require('express');
const router  = express.Router();
const SvcBusUtil = require('../lib/svcbus_util.js').SvcBusUtil;

router.post('/update', function(req, res) {
    var svcbus_util = new SvcBusUtil();
    var override_qname = undefined;
    var body = req.body;
    var jstr = JSON.stringify(body);

    console.log('post /inventory/update body: ' + body);
    console.log('post /inventory/update jstr: ' + jstr);
    
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
    svcbus_util.send_message_to_queue(jstr, 'inventory');
});

module.exports = router;
