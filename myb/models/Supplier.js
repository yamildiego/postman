const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
var ObjectId = require("mongodb").ObjectID;

const SupplierSchema = mongoose.Schema({
  name: String,
  keyClient: String,
  active: Boolean,
  deleted: Boolean,
});

SupplierSchema.plugin(mongoosePaginate);
SupplierSchema.plugin(random);

module.exports = mongoose.model("Supplier", SupplierSchema);
