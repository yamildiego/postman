const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
var ObjectId = require("mongodb").ObjectID;

const OrderSchema = mongoose.Schema({
  address: { address: String, suburb: String, state: String, postcode: String },
  personal: { email: String, phone: String },
  items: [{ price: String, quantity: Number }],
  freeShipping: Boolean,
});

OrderSchema.plugin(mongoosePaginate);
OrderSchema.plugin(random);

module.exports = mongoose.model("Order", OrderSchema);
