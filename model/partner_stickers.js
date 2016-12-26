var mongoose = require('mongoose');
var partnerStickerSchema = new mongoose.Schema({
  bundleId: String,
  stickers: [mongoose.Schema.Types.ObjectId],
  createdAt: {type: Date, default: Date.now}
});
mongoose.model('PartnerSticker', partnerStickerSchema);
