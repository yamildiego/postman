const express = require("express");
const router = express.Router();
var ObjectId = require("mongodb").ObjectID;

const moduleHelper = require("./../functions/moduleHelper");
const getItems = require("./../functions/getItems");
const toMongooseFilter = require("./../functions/toMongooseFilter");
const Profile = require("./../models/Profile");
const Module = require("./../models/Module");

const errors = require("../consts/errors");

router.post("/getItems", async (req, res) => {
  const { keyClient } = req.session.user;
  const { module: moduleName, page = 1, pageSize, sorting, filtering } = req.body;
  const initFilter = { deleted: false, keyClient, ...(filtering ? { ...toMongooseFilter(filtering) } : {}) };
  const sort = sorting?.reduce((acc, sortItem) => {
    acc[sortItem.field] = sortItem.sort === "desc" ? -1 : 1;
    return acc;
  }, {});
  const options = { page, ...(pageSize ? { limit: pageSize } : {}), ...(sort ? { sort } : {}) };

  getItems(res, moduleName, initFilter, options);
});

router.post("/new", async (req, res) => {
  const { keyClient } = req.session.user;
  const { module: moduleName } = req.body;

  try {
    let dataPost = { ...req.body };
    let newItem = moduleHelper.getNewItem(moduleName, dataPost, keyClient);

    newItem.save().then(() => res.send({ status: "OK" }));
  } catch (error) {
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/edit", async (req, res) => {
  const { keyClient } = req.session.user;
  const { module: moduleName, id } = req.body;

  try {
    let module = moduleHelper.getClass(moduleName);
    let newDataItem = { ...req.body };
    delete newDataItem.id, delete newDataItem.module;

    let itemUpdated = await module.findOneAndUpdate({ _id: id, keyClient, deleted: false }, newDataItem, { new: true }).exec();

    if (!itemUpdated) res.status(400).send({ status: errors.ERROR_NO_UPDATED });
    else res.send({ status: "OK" });
  } catch (error) {
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/delete", async (req, res) => {
  const { keyClient } = req.session.user;
  const { module: moduleName, id } = req.body;

  try {
    let module = moduleHelper.getClass(moduleName);
    let itemUpdated = await module.findOneAndUpdate({ _id: id, keyClient, deleted: false }, { deleted: true }, { new: true }).exec();

    if (!itemUpdated) res.status(400).send({ status: errors.ERROR_NO_DELETED });
    else res.send({ status: "OK" });
  } catch (error) {
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/toggleActive", async (req, res) => {
  const { keyClient } = req.session.user;
  const { module: moduleName, id, active } = req.body;

  try {
    let module = moduleHelper.getClass(moduleName);
    let itemUpdated = await module.findOneAndUpdate({ _id: id, keyClient, deleted: false }, { active }, { new: true }).exec();

    if (!itemUpdated) res.status(400).send({ status: errors.ERROR_NO_UPDATED });
    else res.send({ status: "OK" });
  } catch (error) {
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

//TODO: NEED TESTING
// router.post("/getItemsActivesByAutocomplete", async (req, res) => {
//   const { keyClient } = req.session.user;
//   const { module: moduleName } = req.body;
//   const initFilter = { deleted: false, active: true, keyClient };
//   const options = { page: -1 };
//   try {
//     let module = moduleHelper.getClass(moduleName);
//     getItems(res, moduleName, initFilter, options);
//   } catch (error) {
//     res.status(500).send({ status: errors.UNEXPECTED_ERROR });
//   }
// });

router.post("/getItemsActivesBySelect", async (req, res) => {
  const { keyClient } = req.session.user;
  const { module: moduleName } = req.body;
  const initFilter = { deleted: false, active: true, keyClient };

  let module = moduleHelper.getClass(moduleName);

  module.find(initFilter, (err, docs) => {
    const items = docs.reduce((acc, { _id, name }) => ({ ...acc, [_id]: name }), {});
    res.send({ status: "OK", items });
  });
});

//TODO: need testing can be improve
router.post("/checkUnique", async (req, res) => {
  let user = req.session.user;
  let dataPost = { ...req.body };
  let initFilter = { deleted: false, keyClient: user.keyClient };

  if (dataPost.module == "clients" && dataPost.nameInput == "key") delete initFilter.keyClient;

  let module = moduleHelper.getClass(dataPost.module);

  initFilter[dataPost.nameInput] = dataPost.value;
  module.find(initFilter, (err, elements) => {
    if (elements.length > 1) res.send({ status: "OK", error: "DUPLICATE" });
    else if (elements.length == 0) res.send({ status: "OK", error: "NONE" });
    else {
      let value =
        dataPost.isAnObjectId && dataPost.exception !== null ? String(elements[0][dataPost.nameInput]) : elements[0][dataPost.nameInput];
      if (value === dataPost.exception && dataPost.exception !== null) res.send({ status: "OK", error: "NONE" });
      else res.send({ status: "OK", error: "DUPLICATE" });
    }
  });
});

router.post("/checkUniqueGlobal", async (req, res) => {
  let user = req.session.user;
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };

  let module = moduleHelper.getClass(dataPost.module);

  initFilter[dataPost.nameInput] = dataPost.value;

  module.find(initFilter, (err, elements) => {
    if (elements.length > 1) res.send({ status: "OK", error: "DUPLICATE" });
    else if (elements.length == 0) res.send({ status: "OK", error: "NONE" });
    else {
      let value =
        dataPost.isAnObjectId && dataPost.exception !== null ? String(elements[0][dataPost.nameInput]) : elements[0][dataPost.nameInput];
      if (value === dataPost.exception && dataPost.exception !== null) res.send({ status: "OK", error: "NONE" });
      else res.send({ status: "OK", error: "DUPLICATE" });
    }
  });
});

router.post("/editFields", async (req, res) => {
  const { value, id } = req.body;
  const { keyClient } = req.session.user;

  const itemUpdated = await Module.findOneAndUpdate({ keyClient, _id: ObjectId(id) }, { fields: JSON.parse(value) }, { new: true }).lean();

  if (!itemUpdated) res.status(400).send({ status: errors.ERROR_NO_UPDATED });
  else res.send({ status: "OK" });
});

router.post("/editOptions", async (req, res) => {
  const { value, id } = req.body;
  const { keyClient } = req.session.user;

  const itemUpdated = await Module.findOneAndUpdate({ keyClient, _id: ObjectId(id) }, { options: JSON.parse(value) }, { new: true }).lean();

  if (!itemUpdated) res.status(400).send({ status: errors.ERROR_NO_UPDATED });
  else res.send({ status: "OK" });
});

module.exports = router;
