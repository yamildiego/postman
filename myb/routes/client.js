const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const md5 = require("md5");

const Module = require("../models/Module");
const User = require("../models/User");
const Client = require("../models/Client");
const Profile = require("../models/Profile");

const getItemData = require("../functions/getItemData");

const clientValidation = require("../validations/clientValidation");
const formatJoiErrors = require("../validations/formatJoiErrors");

const errors = require("../constants/errors");

router.post("/getAllModules", async (req, res) => {
  try {
    const modules = await Module.find({});
    const itemsData = modules.map(getItemData);
    res.send({ status: "OK", modules: itemsData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/assignModules", async (req, res) => {
  const { id, modules } = req.body;
  const { keyClient } = req.session.user;

  try {
    //Update the modules allows
    const updatedClient = await Client.findOneAndUpdate({ _id: id, keyClient, deleted: false }, { modules }, { new: true });
    const modulesObject = await Module.find({ key: { $in: modules } });
    const permissions = getPermissionsByModule(modulesObject);

    let itemUpdated = await Profile.findByIdAndUpdate(updatedClient.profileAdmin, { permissions }, { new: true }).exec();

    if (!itemUpdated) res.status(400).send({ status: errors.ERROR_NO_UPDATED });
    else res.send({ status: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/new", async (req, res) => {
  const { error, value } = clientValidation.newClientValidation(req.body);
  if (error) return res.status(400).send({ status: errors.ERROR_FORM, errors: formatJoiErrors(error.details) });

  const user = req.session.user;
  const { name_profile, key, username, name_user, lastname, email, password, module } = req.body;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const modulesBase = ["dashboard", "users", "profiles"];
      const modules = await Module.find({ key: { $in: modulesBase } });
      const permissions = getPermissionsByModule(modules);

      const newProfile = new Profile({
        name: name_profile,
        keyClient: key,
        permissions,
        active: true,
        deleted: false,
      });
      const profileCreated = await newProfile.save({ session });

      const newUser = new User({
        username: username.toLowerCase(),
        profile: profileCreated._id,
        name: name_user,
        lastname,
        email,
        password: md5(username.toLowerCase()),
        keyClient: key,
        active: true,
        deleted: false,
      });
      const userCreated = await newUser.save({ session });

      const newClient = new Client({
        name: req.body.name,
        key,
        profileAdmin: profileCreated._id,
        userAdmin: userCreated._id,
        user: profileCreated._id,
        modules: modulesBase,
        keyClient: user.keyClient,
        active: true,
        deleted: false,
      });
      const clientCreated = await newClient.save({ session });

      res.send({ status: "OK" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  } finally {
    session.endSession();
  }
});

const getPermissionsByModule = (modules) => {
  return modules.reduce((acc, module) => {
    const optionsKeys = module.options.map((option) => option.key);
    acc.push({ keyModule: module.key, options: optionsKeys });
    return acc;
  }, []);
};

module.exports = router;
