require('../model/partners');
require('../model/partner_devices');
var config = require('../config.js');
var mongoose = require('mongoose');
var Partner = mongoose.model('Partner');
var PartnerDevice = mongoose.model('PartnerDevice');
var Q = require('q');
var aes = require('nodejs-aes256');
var crypto = require('crypto');

function authPartner(req){
    var deferred = Q.defer();

    if(req.header('x-access-key') === undefined || req.header('x-bundle-id') === undefined){
      deferred.reject({status: 401});
      return deferred.promise;
    }

    var bundleId = aes.decrypt(config.cipher_key, req.header('x-access-key'));
    var curDate = new Date().toLocaleDateString();

    var query = Partner.findOne({
      isActive: true,
      bundleId: bundleId,
      effectiveFrom: {$lte: curDate},
      effectiveEnded: {$gte: curDate}
    });
    query.exec(function(err, partner){
      if(err) deferred.reject({status: 503});
      if(partner === null || req.header('x-bundle-id') != partner.bundleId){
        deferred.reject({status: 401})
      }else{
        var md5 = crypto.createHash('md5');
        md5.update(bundleId + req.header('device-id') + curDate);
        partner.accessToken = md5.digest('hex');
        partner.save();
        var record = new PartnerDevice({deviceId: req.header('device-id'), bundleId: req.header('x-bundle-id')});
        record.save();
        var re = {token: partner.accessToken, scope: partner.permissionScope, co_name: partner.coName};
        deferred.resolve(re);
      }
    });
    return deferred.promise;
};

function authAccess(req){
    var deferred = Q.defer();
    if(req.header('access-token') === undefined){
       deferred.reject({status: 401});
       return deferred.promise;
    }
    Partner.findOne({accessToken: req.header('access-token')}, function(err, partner){
      if(err){ deferred.reject({status: 503})};
      if(partner === null){deferred.reject({status: 401})};
      deferred.resolve();
    })
    return deferred.promise;
}

module.exports = {

    verifyPartner: function(req){
        return authPartner(req);
    },

    stickerAccessible: function(req){
        return authAccess(req);
    }

}
