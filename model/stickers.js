var mongoose = require('mongoose');
var stickerSchema = new mongoose.Schema({
  name: String,
  avatarUrl: String,
  resourceUrl: String,
  usedCount: {type: Number, default: 0},
  isDeleted: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  score:{type: Number, default: 0}
});
mongoose.model('Sticker', stickerSchema);
