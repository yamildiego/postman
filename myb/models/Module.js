const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
const locales = require("../constants/locales");
var ObjectId = require("mongodb").ObjectID;

const ModuleSchema = mongoose.Schema({
  key: String,
  name_en: String,
  name_es: String,
  mainFunction: String,
  icon: String,
  options: [{ key: String, title: { [locales.ENGLISH]: String, [locales.SPANISH]: String } }],
  fields: [
    {
      key: String,
      name: { [locales.ENGLISH]: String, [locales.SPANISH]: String },
      typew: String,
      isMultiple: Boolean,
      module: String,
      minValue: Number,
      maxValue: Number,
      urlValues: String,
      values: Object,
      defaultValue: String,
      visibleTable: Boolean,
      visibleForm: Boolean,
      validations: [String],
    },
  ],
});

ModuleSchema.plugin(mongoosePaginate);
ModuleSchema.plugin(random);

module.exports = mongoose.model("Module", ModuleSchema);
