const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
var ObjectId = require("mongodb").ObjectID;

const UserSchema = mongoose.Schema({
  user: String,
  profile: ObjectId,
  name: String,
  lastname: String,
  email: String,
  password: String,
  keyClient: String,
  active: Boolean,
  deleted: Boolean,
});

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(random);

module.exports = mongoose.model("User", UserSchema);
