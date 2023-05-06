const express = require("express");
const router = express.Router();
const { assign } = require("lodash");
const ObjectId = require("mongodb").ObjectID;

const Profile = require("../models/Profile");
const User = require("../models/User");
const Module = require("../models/Module");
const Client = require("../models/Client");

const errors = require("./../constants/errors");

router.post("/getProfiles", async (req, res) => {
  try {
    const { keyClient } = req.session.user;
    const initFilter = { keyClient, active: true, deleted: false };

    const profiles = await Profile.find(initFilter).lean();

    res.send({ status: "OK", elements: profiles });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/loadModulesByProfile", async (req, res) => {
  const { id } = req.body;
  const { keyClient } = req.session.user;

  const profile = await Profile.findById(id).lean();
  const client = await Client.findOne({ key: profile.keyClient, deleted: false, active: true }).lean();

  if (!client) res.send({ status: "OK", elements: [] });
  else {
    const modules = await Module.find({ key: { $in: client.modules }, deleted: false }).lean();
    res.send({ status: "OK", elements: modules });
  }
});

router.post("/assignProfile", async (req, res) => {
  try {
    const { id, profiles } = req.body;
    const { keyClient } = req.session.user;

    const itemUpdated = await Profile.findOneAndUpdate({ ...initFilter, _id: ObjectId(id) }, { profiles }, { new: true }).lean();

    if (!itemUpdated) res.status(400).send({ status: errors.ERROR_NO_UPDATED });
    else res.send({ status: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/editPermissions", async (req, res) => {
  try {
    const { id, permissions } = req.body;
    const { keyClient } = req.session.user;

    const itemUpdated = await Profile.findOneAndUpdate({ ...initFilter, _id: ObjectId(id) }, { permissions }, { new: true }).lean();

    if (!itemUpdated) res.status(400).send({ status: errors.ERROR_NO_UPDATED });
    else res.send({ status: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/getProfilesActivesBySelect", async (req, res) => {
  try {
    const { keyClient, profile } = req.session.user;
    const initFilter = { keyClient, deleted: false, active: true };

    const user_profile = await Profile.findById(profile).lean();
    const docs = await Profile.find({ _id: { $in: user_profile.profiles }, ...initFilter }).lean();

    const items = docs.reduce((acc, doc) => assign(acc, { [doc._id]: doc.name }), {});

    res.send({ status: "OK", items });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

module.exports = router;
