// Chris Joakim, Microsoft, 2017/03/31

const express = require('express');
const router  = express.Router();

const swag = require("../swagger.json");

router.get('/', function(req, res) {
  res.json(swag);
});

module.exports = router;

