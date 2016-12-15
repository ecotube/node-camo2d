var mongoose = require('mongoose');
var partnerDeviceSchema = new mongoose.Schema({
  bundleId: String,
  deviceId: String,
  createdAt: {type: Date, default: Date.now}
});
mongoose.model('PartnerDevice', partnerDeviceSchema);
