const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
var ObjectId = require("mongodb").ObjectID;

const ClientSchema = mongoose.Schema({
  name: String,
  key: String,
  logoUrl: String,
  userAdmin: ObjectId,
  profileAdmin: ObjectId,
  modules: [String],
  theme: {
    palette: {
      primary: {
        main: String,
        dark: String,
        light: String,
        contrastText: String,
      },
      secondary: {
        main: String,
        dark: String,
        light: String,
        contrastText: String,
      },
    },
  },
  active: Boolean,
  keyClient: String,
  deleted: Boolean,
});

ClientSchema.plugin(mongoosePaginate);
ClientSchema.plugin(random);

module.exports = mongoose.model("Client", ClientSchema);
