const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
var ObjectId = require("mongodb").ObjectID;

const BrandSchema = mongoose.Schema({
  name: String,
  keyClient: String,
  active: Boolean,
  deleted: Boolean,
});

BrandSchema.plugin(mongoosePaginate);
BrandSchema.plugin(random);

module.exports = mongoose.model("Brand", BrandSchema);
