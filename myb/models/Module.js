const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");
const locales = require("../consts/locales");
var ObjectId = require("mongodb").ObjectID;

const ModuleSchema = mongoose.Schema({
  key: String,
  name_en: String,
  name_es: String,
  icon: String,
  mainFunction: String,
  options: [{ key: String, title: { [locales.ENGLISH]: String, [locales.SPANISH]: String }, url: String }],
  fields: [
    {
      key: String,
      name: { [locales.ENGLISH]: String, [locales.SPANISH]: String },
      typew: String,
      module: String,
      defaultValue: String,
      urlValues: { type: String, required: false },
      values: { type: Object, required: false },
      minValue: { type: Number, required: false },
      maxValue: { type: Number, required: false },
      isMultiple: { type: Boolean, required: false },
      autocomplete: { type: String, required: false },
      disabled: { type: [String], required: false },
      visible: { type: [String], required: false },
      validations: { type: [String], required: false },
      filterable: { type: Boolean, required: false },
    },
  ],
  active: Boolean,
  keyClient: String,
  deleted: Boolean,
});

ModuleSchema.plugin(mongoosePaginate);
ModuleSchema.plugin(random);

module.exports = mongoose.model("Module", ModuleSchema);
