const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
var ObjectId = require("mongodb").ObjectID;

const ProductSchema = mongoose.Schema({
  code: String,
  title: String,
  subtitle: String,
  price: Number,
  category: String,
  release_date: Number,
  genders: [String],
  active: Boolean,
  keyClient: String,
  deleted: Boolean,
});

ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(random);

module.exports = mongoose.model("Product", ProductSchema);
