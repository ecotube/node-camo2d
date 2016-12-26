var express = require('express');
var router = express.Router();
var Q = require('q');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var Uploader = require('../service/uploader');

router.post('/stickers/part', multipartMiddleware, function(req, res, next){
  Uploader.upload(res, req.files.spart.path, new Date().getTime() + '_' + req.files.spart.originalFilename);
});

router.post('/stickers/avatar', multipartMiddleware, function(req, res, next){
  Uploader.upload(res, req.files.avatar.path, new Date().getTime() + '_' + req.files.avatar.originalFilename);
});

router.post('/stickers/resource', multipartMiddleware, function(req, res, next){
  Uploader.upload(res, req.files.resource.path, new Date().getTime() + '_' + req.files.resource.originalFilename);
});

module.exports = router;
