const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
var ObjectId = require("mongodb").ObjectID;

const ProductSchema = mongoose.Schema({
  cloudProductId: String,
  title: String,
  subtitle: String,
  category: String,
  genders: [String],
  currentPrice: Number,
  fullPrice: Number,
  priceId: String,
  colorways: [{ colorDescription: String, images: Object }],
  skuData: [Object],
  images: Object,
  isOnSale: Boolean,
  active: Boolean,
  deleted: Boolean,
  keyClient: String,
});

ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(random);

module.exports = mongoose.model("Product", ProductSchema);
