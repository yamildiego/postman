const { PAGE_LIMIT } = require("../consts/constants");
const moduleHelper = require("./moduleHelper");
const Module = require("./../models/Module");
const getItemData = require("./getItemData");

const getItems = async (res, moduleName, initFilter, optionsParams = {}) => {
  try {
    const module = await moduleHelper.getClass(moduleName);
    const item = await Module.findOne({ key: moduleName });
    const options = optionsParams.page !== -1 ? { limit: PAGE_LIMIT, ...optionsParams } : {};
    const result = await module.paginate(initFilter, options);

    let itemsData = result.docs.map((doc) => getItemData(doc));

    if (moduleName === "modules") {
      let fieldsAllowed = item.fields.filter((field) => "visibleTable" in field && field.visibleTable);
      let keysFieldsAllowed = fieldsAllowed.map((field) => field.key);
      itemsData = result.docs.map((doc) => getItemDataModule(doc, fieldsAllowed, keysFieldsAllowed));
    }

    res.send({ status: "OK", items: itemsData, totalPages: result.totalPages, totalItems: result.totalDocs });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};

const getItemDataModule = (item, fieldsAllowed, keysFieldsAllowed = []) => {
  const { password, __v, keyClient, deleted, ...data } = item.toObject();
  const allowedFields = Object.keys(data).filter((key) => keysFieldsAllowed.includes(key));

  allowedFields.forEach((key) => {
    const field = fieldsAllowed.find((f) => f.key === key);
    const isAutocomplete = field?.typew === "autocomplete";
    const hasSingleValue = field?.isMultiple !== true;

    if (isAutocomplete && hasSingleValue) {
      const labelKey = `${key}_label`;
      data[labelKey] = field.values[data[key]];
    }
  });

  return data;
};

module.exports = getItems;
