require('../model/stickers');
var mongoose = require('mongoose');
var Sticker = mongoose.model('Sticker');
var defaultLimit = 10;
var jsonfile = require('jsonfile');
var path = require('path');
var Q = require('q');

function getList(params){
    var deferred = Q.defer();
    var limit = params.limit ? parseInt(params.limit, 10) : defaultLimit;
    var skip = params.skip ? parseInt(params.skip, 10) : 0;
    Sticker.find({isDeleted: false}).limit(limit).skip(limit * skip).exec(function(err, data){
        if(err){ deferred.reject({status: 503}); };
        deferred.resolve(data);
    })
    return deferred.promise;
};

function generateFile(reqBody){
    var deferred = Q.defer();
    var params = '';
    // temporary solution
    for(var key in reqBody){ params = JSON.parse(key);}
    for(var i in params){
        params[i].scaleHeigthtOffset = 0;
        params[i].alignPos = 0;
        params[i].alignX = 0;
        params[i].alignY = 0;
        params[i].frameDuration = 100;
        params[i].triggerType = 0;
    }
    jsonfile.writeFile(path.join(__dirname, '../public/config.json'), params, function (err) {
        if(err){ deferred.reject(err) };
        deferred.resolve({});
    })
    return deferred.promise;
}

module.exports = {

    fetchList: function(req){
        return getList(req.query);
    },

    generateFile: function(req){
        return generateFile(req.body);
    }

}
