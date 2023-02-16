const express = require("express");
const router = express.Router();
var ObjectId = require("mongodb").ObjectID;

const moduleHelper = require("./../functions/moduleHelper");
const Profile = require("./../models/Profile");
const Module = require("./../models/Module");
const Config = require("../constants/Config");
const checkIsSuperAdmin = require("../functions/checkIsSuperAdmin");

router.post("/getItems", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let options = { page: dataPost.page ? dataPost.page : 1 };
  let isSuperAdmin = req.session.user.profile == Config.ID_SUPERADMIN;
  if (!isSuperAdmin) initFilter["keyClient"] = req.session.user.keyClient;

  elements(res, dataPost.module, initFilter, options);
});

router.post("/new", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let options = { page: dataPost.page ? dataPost.page : 1 };
  let user = req.session.user;
  let isSuperAdmin = user.profile == Config.ID_SUPERADMIN;
  let keyClient = user.keyClient;

  if (!isSuperAdmin) initFilter["keyClient"] = user.keyClient;
  else keyClient = dataPost.keyClient;

  let newItem = null;
  if (dataPost.module === "users") {
    Profile.findById(dataPost.profile, (err, item) => {
      if (!err) newItem = moduleHelper.getNewItem(dataPost.module, dataPost, item.keyClient);
      else newItem = moduleHelper.getNewItem(dataPost.module, dataPost, keyClient);

      newItem.save().then(() => elements(res, dataPost.module, initFilter, options));
    });
  } else {
    newItem = moduleHelper.getNewItem(dataPost.module, dataPost, keyClient);
    newItem.save().then(() => elements(res, dataPost.module, initFilter, options));
  }
});

router.post("/edit", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let options = { page: dataPost.page ? dataPost.page : 1 };
  let user = req.session.user;
  let isSuperAdmin = user.profile == Config.ID_SUPERADMIN;
  let keyClient = user.keyClient;

  if (!isSuperAdmin) initFilter["keyClient"] = user.keyClient;
  else keyClient = dataPost.keyClient;

  let module = moduleHelper.getClass(dataPost.module);
  let newDataItem = { ...dataPost };
  delete newDataItem.id, delete newDataItem.module, delete newDataItem.keyClient;

  module.findByIdAndUpdate(dataPost.id, newDataItem, { new: true }, (err, itemUpdated) => {
    elements(res, dataPost.module, initFilter, options);
  });
});

router.post("/delete", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let options = { page: dataPost.page ? dataPost.page : 1 };
  let user = req.session.user;
  let isSuperAdmin = user.profile == Config.ID_SUPERADMIN;

  if (!isSuperAdmin) initFilter["keyClient"] = user.keyClient;

  let module = moduleHelper.getClass(dataPost.module);

  module.findByIdAndUpdate(dataPost.id, { deleted: true }, { new: true }, (err, itemUpdated) => {
    elements(res, dataPost.module, initFilter, options);
  });
});

router.post("/toggleActive", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let options = { page: dataPost.page ? dataPost.page : 1 };
  let user = req.session.user;
  let isSuperAdmin = user.profile == Config.ID_SUPERADMIN;

  if (!isSuperAdmin) initFilter["keyClient"] = user.keyClient;

  let module = moduleHelper.getClass(dataPost.module);

  module.findByIdAndUpdate(dataPost.id, { active: dataPost.active }, { new: true }, (err, itemUpdated) => {
    elements(res, dataPost.module, initFilter, options);
  });
});

router.post("/getItemsActivesByAutocomplete", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false, active: true };
  let options = { page: -1 };
  let user = req.session.user;
  let isSuperAdmin = user.profile == Config.ID_SUPERADMIN;
  let keyClient = user.keyClient;

  initFilter["keyClient"] = isSuperAdmin ? dataPost.keyClient : user.keyClient;

  let module = moduleHelper.getClass(dataPost.module);
  elements(res, dataPost.module, initFilter, options);
});

router.post("/getItemsActivesBySelect", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false, active: true };
  let user = req.session.user;
  let isSuperAdmin = req.session.user.profile == Config.ID_SUPERADMIN;
  let keyClient = user.keyClient;

  initFilter["keyClient"] = isSuperAdmin ? dataPost.keyClient : user.keyClient;

  let module = moduleHelper.getClass(dataPost.module);

  module.find(initFilter, (err, docs) => {
    let items = {};
    docs.forEach((doc) => {
      items[doc._id] = doc.name;
    });

    res.send({ status: "OK", items });
  });
});

router.post("/checkUnique", async (req, res) => {
  let dataPost = { ...req.body };
  let user = req.session.user;
  let isSuperAdmin = user.profile == Config.ID_SUPERADMIN;
  let initFilter = { deleted: false };

  if (dataPost.module !== "users") initFilter.keyClient = isSuperAdmin ? dataPost.keyClient : user.keyClient;

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
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let options = { page: dataPost.page ? dataPost.page : 1 };
  let user = req.session.user;
  let fields = JSON.parse(dataPost.value);

  checkIsSuperAdmin(res, user, () => {
    Module.findByIdAndUpdate(dataPost.id, { fields }, { new: true }, (err, itemUpdated) => {
      elements(res, "modules", initFilter, options);
    });
  });
});

router.post("/editOptions", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let optionsParams = { page: dataPost.page ? dataPost.page : 1 };
  let user = req.session.user;
  let options = JSON.parse(dataPost.value);

  checkIsSuperAdmin(res, user, () => {
    Module.findByIdAndUpdate(dataPost.id, { options }, { new: true }, (err, itemUpdated) => {
      elements(res, "modules", initFilter, optionsParams);
    });
  });
});

elements = (res, moduleName, initFilter, optionsParams = {}) => {
  let module = moduleHelper.getClass(moduleName);
  Module.findOne({ key: moduleName }, (err, item) => {
    let fieldsAllowed = [];
    let keysFieldsAllowed = [];
    item.fields.forEach((field) => {
      if ("visibleTable" in field && field.visibleTable) {
        fieldsAllowed.push(field);
        keysFieldsAllowed.push(field.key);
      }
    });

    let options = {};
    if (optionsParams.page !== -1) options = { limit: 8, ...optionsParams };

    module.paginate(initFilter, options, (err, result) => {
      let itemsData = [];
      result.docs.forEach((doc) => {
        itemsData.push(getItemData(doc, fieldsAllowed, keysFieldsAllowed));
      });

      res.send({ status: "OK", items: itemsData, totalPages: result.totalPages, totalItems: result.totalDocs });
    });
  });
};

function getItemData(item, fieldsAllowed, keysFieldsAllowed = []) {
  let data = item.toObject();
  delete data.password, delete data.__v;
  if (fieldsAllowed.length > 0) {
    Object.keys(data).forEach((key) => {
      if (!keysFieldsAllowed.includes(key)) {
        //       delete data[key];
      } else {
        let field = fieldsAllowed.filter((f) => f.key === key)[0];
        if (
          "values" in field &&
          field.typew === "autocomplete" &&
          (!("isMultiple" in field) || ("isMultiple" in field && !field.isMultiple))
        ) {
          let newKey = key + "_label";
          data[newKey] = field.values[data[key]];
        }
      }
    });
  }
  return data;
}

module.exports = router;
