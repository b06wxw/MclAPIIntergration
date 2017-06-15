// Chris Joakim, Microsoft, 2017/03/31

const express = require('express');
const router  = express.Router();
const SvcBusUtil = require('../lib/svcbus_util.js').SvcBusUtil;

// The build_timestamp.json file is generated by Grunt
const build_timestamp_obj = require("../build_timestamp.json");

router.get('/ping', function(req, res) {
  res.json({date: new Date()});
});

router.get('/build', function(req, res) {
  res.json(build_timestamp_obj);
});

router.get('/queue_info/:qname', function(req, res) {
    var svcbus_util = new SvcBusUtil();
    var override_qname = undefined;

    svcbus_util.on('done', function(evt_obj) {
      console.log(evt_obj);
      if (evt_obj['error']) {
        res.status(400);
        return res.send({error: true});
      }
      else {
        var resp_obj = {};
        resp_obj['name']   = evt_obj['queue']['QueueName'];
        resp_obj['depth']  = evt_obj['queue']['MessageCount'];
        resp_obj['status'] = evt_obj['queue']['Status'];
        return res.json(resp_obj);
      }
    });
    svcbus_util.get_queue_info(req.params.qname);
});

module.exports = router;
