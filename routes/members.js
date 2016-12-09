var express = require('express');
var router = express.Router();
var Q = require('q');
var MemberService = require('../service/member-service');

router.post('/', function(req, res, next) {
  MemberService.createMember(req)
  .fail(function(err){
    res.status(err.status).end();
  })
  .then(function(data){
    res.json(data);
  })
});

router.put('/push', function(req, res, next){
  MemberService.switchPush(req)
  .fail(function(err){
    res.status(err.status).end();
  })
  .then(function(data){
    res.status(200).end();
  })
});

module.exports = router;
