var mongoose = require('mongoose');
var memberSchema = new mongoose.Schema({
  deviceId: String,
  pushToken: String,
  deviceType: Number,   //0 ios , 1 android, 2 other
  createdAt: String,
});
mongoose.model('Member', memberSchema);
