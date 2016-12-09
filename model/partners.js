var mongoose = require('mongoose');
var partnerSchema = new mongoose.Schema({
  coName: String,
  appName: String,
  contactNo: String,
  bundleId: String,
  effectiveFrom: String,
  effectiveEnded: String,
  accessToken: {type: String, default: ''},
  isActive: {type: Boolean, default: false}
});
mongoose.model('Partner', partnerSchema);
