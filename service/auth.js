require('../model/partners');
var mongoose = require('mongoose');
var Partner = mongoose.model('Partner');
var Q = require('q');
var key = 'camo2d-sdk-2016';
var aes = require('nodejs-aes256');
var crypto = require('crypto');

function authPartner(req){
    var deferred = Q.defer();

    if(req.header('x-access-key') === undefined || req.header('x-bundle-id') === undefined){
      deferred.reject({status: 401});
      return deferred.promise;
    }

    var bundleId = aes.decrypt(key, req.header('x-access-key'));
    var curDate = new Date().toLocaleDateString();

    var query = Partner.findOne({
       isActive: true,
       bundleId: bundleId,
       effectiveFrom: {$lte: curDate},
       effectiveEnded: {$gte: curDate}
    });
    query.exec(function(err, partner){
        if(err){ deferred.reject({status: 503})};
        if(partner === null || req.header('x-bundle-id') != partner.bundleId){
          deferred.reject({status: 401})
        }
        var md5 = crypto.createHash('md5');
        md5.update(bundleId + req.header('device-id') + curDate);
        partner.accessToken = md5.digest('hex');
        partner.save();
        deferred.resolve(partner);
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
