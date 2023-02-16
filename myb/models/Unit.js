const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
var ObjectId = require("mongodb").ObjectID;

const UnitSchema = mongoose.Schema({
  title: String,
  lvl: String,
  exercises: [
    {
      typew: String,
      data: {
        guideline: String,
        random: Boolean,
        lines: [Object],
      },
    },
  ],
  keyClient: String,
  active: Boolean,
  deleted: Boolean,
});

UnitSchema.plugin(mongoosePaginate);
UnitSchema.plugin(random);

module.exports = mongoose.model("Unit", UnitSchema);
