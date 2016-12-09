var qiniu = require('qiniu');
var config = require('../config');

qiniu.conf.ACCESS_KEY = config.qiniu.access_key;
qiniu.conf.SECRET_KEY = config.qiniu.secret_key;

function uptoken(bucket, key){
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

function uploadFile(res, uptoken, key, localFile, bucketUrl) {
  var extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        res.json({file: bucketUrl + key});
      } else {
        res.json(err);
      }
  });
}

module.exports = {
  upload: function(res, localFile, remoteFile, bucket_name, bucket_url){
      var bucketName = bucket_name ? bucket_name : config.qiniu.bucket_name;
      var bucketUrl = bucket_url ? bucket_url : config.qiniu.bucket_url;
      var token = uptoken(bucketName, remoteFile);
      uploadFile(res, token, remoteFile, localFile, bucketUrl);
  }
}
