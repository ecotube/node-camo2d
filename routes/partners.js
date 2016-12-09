var express = require('express');
var router = express.Router();
var Q = require('q');
var Auth = require('../service/auth');

/* GET users listing. */
router.post('/auth', function(req, res, next) {
  Auth.verifyPartner(req)
  .fail(function(err){
    res.status(err.status).end();
  })
  .then(function(data){
    res.json(data);
  })
});

module.exports = router;
