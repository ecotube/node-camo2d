var mongoose = require('mongoose');
var stickerSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  resourceUrl: String,
  usedCount: {type: Number, default: 0},
  isDeleted: {type: Boolean, default: false}
});
mongoose.model('Sticker', stickerSchema);
