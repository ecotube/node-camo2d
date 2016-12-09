require('../model/members');
var mongoose = require('mongoose');
var Member = mongoose.model('Member');
var Q = require('q');

function insertMember(params){
    var deferred = Q.defer();
    var platform = params.platform === "iOS" ? 0 : (params.platform === "Android" ? 1 : 2);
    var d = {
      deviceId: params.device_id,
      pushToken: params.push_token,
      deviceType: platform,
      createdAt: new Date().toLocaleString()
    };
    Member.findOneAndUpdate({deviceId: d.deviceId}, {$set:d}, {upsert: true, new: true}, function(err, data){
      if(err){ deferred.reject({status: 503}); };
      deferred.resolve(data);
    });
    return deferred.promise;
};

function updateMemberPush(params){
    var deferred = Q.defer();
    var conditions = {deviceId: params.device_id}
      , update = { $set: {pushToken: params.push_token}};
    Member.update(conditions, update, function(err, data){
      if(err){ deferred.reject({status: 503}); };
      deferred.resolve(data);
    })
    return deferred.promise;
}

module.exports = {

    createMember: function(req){
        return insertMember(req.body);
    },

    switchPush: function(req){
        return updateMemberPush(req.body);
    }

}
