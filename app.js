var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes/index');
var partners = require('./routes/partners');
var stickers = require('./routes/stickers');
var members = require('./routes/members');
var media = require('./routes/media');

var app = express();
var db = require('./model/db');
// view engine setup
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/partners', partners);
app.use('/stickers', stickers);
app.use('/members', members);
app.use('/media', media)

// only for download configure file
app.get('/download/:name', function(req, res, next) {
 // 实现文件下载
 var fileName = req.params.name;
 var filePath = path.join(__dirname, 'public/' + fileName);
 var stats = fs.statSync(filePath);
 if(stats.isFile()){
  res.set({
   'Content-Type': 'application/octet-stream',
   'Content-Disposition': 'attachment; filename='+fileName,
   'Content-Length': stats.size
  });
  fs.createReadStream(filePath).pipe(res);
 } else {
  res.end(404);
 }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if(err.status === 404){ res.status(err.status).end() }
    else{
      res.status(err.status || 500);
      res.render('error', {
        message: '',
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: '',
    error: {}
  });
});


module.exports = app;
