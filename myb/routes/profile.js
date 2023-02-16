const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");
const User = require("../models/User");
const Module = require("../models/Module");
const Client = require("../models/Client");
const Config = require("./../constants/Config");

router.post("/getProfiles", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false, active: true };
  let isSuperAdmin = req.session.user.profile == Config.ID_SUPERADMIN;
  if (!isSuperAdmin) initFilter["keyClient"] = dataPost.keyClient;

  Profile.find(initFilter, (err, elements) => {
    let elementsData = [];

    elements.forEach((item) => {
      if (String(item._id) !== String(Config.ID_SUPERADMIN)) elementsData.push(getItemData(item));
    });

    res.send({ status: "OK", elements: elementsData });
  });
});

router.post("/loadModulesByProfile", async (req, res) => {
  let dataPost = { ...req.body };

  Profile.findById(dataPost.id, (err, item) => {
    Client.findOne({ key: item.keyClient, deleted: false, active: true }, (err, doc) => {
      if (doc) {
        Module.find({ key: { $in: doc.modules }, deleted: false, active: true }, (err, docs) => {
          res.send({ status: "OK", elements: docs });
        });
      } else res.send({ status: "OK", elements: [] });
    });
  });
});

router.post("/assignProfile", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let isSuperAdmin = req.session.user.profile == Config.ID_SUPERADMIN;
  if (!isSuperAdmin) initFilter["keyClient"] = dataPost.keyClient;
  let optionsParams = { page: dataPost.page ? dataPost.page : 1 };
  let options = optionsParams.page !== -1 ? { limit: 8, ...optionsParams } : {};

  Profile.findByIdAndUpdate(dataPost.id, { profiles: dataPost.profiles }, { new: true }, (err, itemUpdated) => {
    Profile.paginate(initFilter, options, (err, result) => {
      let itemsData = [];

      result.docs.forEach((item) => {
        itemsData.push(getItemData(item));
      });

      res.send({ status: "OK", items: itemsData, totalPages: result.totalPages, totalItems: result.totalDocs });
    });
  });
});

router.post("/editPermissions", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let isSuperAdmin = req.session.user.profile == Config.ID_SUPERADMIN;
  if (!isSuperAdmin) initFilter["keyClient"] = dataPost.keyClient;
  let optionsParams = { page: dataPost.page ? dataPost.page : 1 };
  let options = optionsParams.page !== -1 ? { limit: 8, ...optionsParams } : {};

  Profile.findByIdAndUpdate(dataPost.id, { permissions: dataPost.permissions }, { new: true }, (err, itemUpdated) => {
    Profile.paginate(initFilter, options, (err, result) => {
      let itemsData = [];

      result.docs.forEach((item) => {
        itemsData.push(getItemData(item));
      });
      res.send({ status: "OK", items: itemsData, totalPages: result.totalPages, totalItems: result.totalDocs });
    });
  });
});

router.post("/getProfilesActivesBySelect", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false, active: true };
  let isSuperAdmin = req.session.user.profile == Config.ID_SUPERADMIN;

  if (isSuperAdmin) {
    Profile.find(initFilter, (err, docs) => {
      let items = {};
      docs.forEach((doc) => {
        items[doc._id] = doc.name;
      });

      res.send({ status: "OK", items });
    });
  } else {
    Profile.findById(req.session.user.profile, (err, profile) => {
      Profile.find({ _id: { $in: profile.profiles }, ...initFilter, keyClient: req.session.user.keyClient }, (err, docs) => {
        let items = {};
        docs.forEach((doc) => {
          items[doc._id] = doc.name;
        });

        res.send({ status: "OK", items });
      });
    });
  }
});

router.post("/getClientsActivesBySelect", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false, active: true };

  Client.find({ ...initFilter }, (err, docs) => {
    let items = {};
    docs.forEach((doc) => (items[doc.key] = doc.name));

    res.send({ status: "OK", items });
  });
});

router.post("/assignClient", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let isSuperAdmin = req.session.user.profile == Config.ID_SUPERADMIN;
  let optionsParams = { page: dataPost.page ? dataPost.page : 1 };
  let options = optionsParams.page !== -1 ? { limit: 8, ...optionsParams } : {};

  if (isSuperAdmin) {
    initFilter["keyClient"] = dataPost.keyClient;

    Profile.findByIdAndUpdate(dataPost.id, { keyClient: dataPost.keyClient }, { new: true }, (err, itemUpdated) => {
      Profile.paginate(initFilter, options, (err, result) => {
        let itemsData = [];
        result.docs.forEach((item) => itemsData.push(getItemData(item)));

        res.send({ status: "OK", items: itemsData, totalPages: result.totalPages, totalItems: result.totalDocs });
      });
    });
  } else res.send({ status: "ERROR" });
});

function getItemData(item) {
  let data = item.toObject();
  delete data.__v;
  return data;
}

module.exports = router;
