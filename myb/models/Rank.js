const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");

const RankSchema = mongoose.Schema({
  name: String,
  lvl: Number,
  score: Number,
});

RankSchema.plugin(mongoosePaginate);
RankSchema.plugin(random);

module.exports = mongoose.model("Rank", RankSchema);
