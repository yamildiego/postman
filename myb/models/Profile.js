const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
var ObjectId = require("mongodb").ObjectID;

const ProfileSchema = mongoose.Schema({
  name: String,
  profiles: [String],
  permissions: [{ keyModule: String, options: [String] }],
  keyClient: String,
  active: Boolean,
  deleted: Boolean,
});

ProfileSchema.plugin(mongoosePaginate);
ProfileSchema.plugin(random);

module.exports = mongoose.model("Profile", ProfileSchema);
