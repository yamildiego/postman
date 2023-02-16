const express = require("express");
const router = express.Router();

const Module = require("../models/Module");
const Client = require("../models/Client");
const Profile = require("../models/Profile");
const Config = require("./../constants/Config");
const checkIsSuperAdmin = require("../functions/checkIsSuperAdmin");

router.post("/getAllModules", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = {};

  let mod = [];
  Module.find({}, (err, items) => {
    let itemsData = [];

    items.forEach((item) => {
      itemsData.push(getItemData(item));
    });

    res.send({ status: "OK", modules: itemsData });
  });
});

router.post("/assignModules", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let optionsParams = { page: dataPost.page ? dataPost.page : 1 };
  let options = optionsParams.page !== -1 ? { limit: 8, ...optionsParams } : {};

  Client.findByIdAndUpdate(dataPost.id, { modules: dataPost.modules }, { new: true }, (err, itemUpdated) => {
    Client.paginate(initFilter, options, (err, result) => {
      let itemsData = [];

      result.docs.forEach((item) => {
        itemsData.push(getItemData(item));
      });

      res.send({ status: "OK", items: itemsData, totalPages: result.totalPages, totalItems: result.totalDocs });
    });
  });
});

router.post("/assignAdmin", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = {};
  let optionsParams = { page: dataPost.page ? dataPost.page : 1 };
  let options = optionsParams.page !== -1 ? { limit: 8, ...optionsParams } : {};

  Client.findByIdAndUpdate(dataPost.id, { admin: dataPost.admin }, { new: true }, (err, itemUpdated) => {
    Profile.findByIdAndUpdate(dataPost.admin, { keyClient: dataPost.keyClient }, (err, profileUpdated) => {
      Client.paginate(initFilter, options, (err, result) => {
        let itemsData = [];

        result.docs.forEach((item) => {
          itemsData.push(getItemData(item));
        });

        res.send({ status: "OK", items: itemsData, totalPages: result.totalPages, totalItems: result.totalDocs });
      });
    });
  });
});

router.post("/getProfilesActivesNoClientBySelect", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false, active: true, keyClient: dataPost.keyClient };

  Profile.find({ ...initFilter }, (err, docs) => {
    let items = {};

    docs.forEach((doc) => {
      if (doc._id != Config.ID_SUPERADMIN) {
        items[doc._id] = doc.name;
      }
    });
    res.send({ status: "OK", items });
  });
});

function getItemData(mod) {
  let data = mod.toObject();
  delete data._id;
  return data;
}

module.exports = router;
