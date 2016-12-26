require('../model/stickers');
require('../model/partner_stickers');
var mongoose = require('mongoose');
var Sticker = mongoose.model('Sticker');
var PartnerSticker = mongoose.model('PartnerSticker');
var jsonfile = require('jsonfile');
var path = require('path');
var Q = require('q');
var defaultLimit = 10;

function getList(req){
    var deferred = Q.defer();
    var limit = req.query.limit ? parseInt(req.query.limit, 10) : defaultLimit;
    var skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;
    PartnerSticker.findOne({bundleId: req.header('x-bundle-id')}).exec(function(err, data){
        if(err || data === null){ deferred.reject({status: 503}); };
        // edit in promise
        Sticker.find({'_id': { $in: data.stickers}, isDeleted: false}).limit(limit).skip(limit * skip).sort({score: 'desc', createdAt: 'desc'}).exec(function(err, data){
            deferred.resolve(data);
        })
    })
    return deferred.promise;
};

function generateFile(reqBody){
    var deferred = Q.defer();
    var params = '';
    // temporary solution
    for(var key in reqBody){ params = JSON.parse(key);}
    for(var i in params){
        params[i].alignPos = 0;
        params[i].alignX = 0;
        params[i].alignY = 0;
        params[i].frameDuration = 100;
        params[i].triggerType = 0;
    }
    jsonfile.writeFile(path.join(__dirname, '../public/config.json'), params, function (err) {
        if(err){ deferred.reject(err) }
        else{ deferred.resolve({}) }
    })
    return deferred.promise;
}

function add(req){
    var deferred = Q.defer();
    var sticker = new Sticker({
      avatarUrl: req.body.avatar_url,
      resourceUrl: req.body.resource_url,
      name: req.body.name
    });
    sticker.save(function(err){
      if(err){ deferred.reject({status: 503}); }
      deferred.resolve({})
    });
    return deferred.promise;
}

module.exports = {

    fetchList: function(req){
        return getList(req);
    },

    generateFile: function(req){
        return generateFile(req.body);
    },

    addOne: function(req){
      console.log(req.body)
      return add(req);
    }

}
