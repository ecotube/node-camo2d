var mongoose = require('mongoose');
var partnerSchema = new mongoose.Schema({
  coName: String,
  appName: String,
  contactNo: String,
  bundleId: String,
  effectiveFrom: String,
  effectiveEnded: String,
  accessToken: {type: String, default: ''},
  isActive: {type: Boolean, default: false},
  permissionScope : {
    tracker: {type: Boolean, default: true},
    beauty: {type: Boolean, default: false},
    stickers: {type: Boolean, default: false},
    filters: {type: Boolean, default: false},
    mirrors: {type: Boolean, default: false}
  }
});
mongoose.model('Partner', partnerSchema);
