var express = require('express');
var router = express.Router();
var Q = require('q');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.post('/', multipartMiddleware, function(req, res, next){
  console.log(req.files);
});
