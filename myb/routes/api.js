const express = require("express");
const router = express.Router();
const md5 = require("md5");

const Profile = require("../models/Profile");
const Client = require("../models/Client");
const Module = require("../models/Module");
const User = require("../models/User");

const baseValidation = require("../validations/baseValidation");
const formatJoiErrors = require("../validations/formatJoiErrors");

const getItemData = require("../functions/getItemData");

const errors = require("../consts/errors");

router.post("/loadConfig", async (req, res) => {
  const user = req.session.user;
  const { keyClient } = user;
  let mod = [];
  try {
    const client = await Client.findOne({ key: keyClient, deleted: false });

    if (!client) return res.status(400).send({ status: errors.UNEXPECTED_ERROR });
    else {
      let theme =
        "theme" in client &&
        "palette" in client.theme &&
        "primary" in client.theme.palette &&
        "main" in client.theme.palette.primary &&
        client.theme.palette.primary.main
          ? client.theme
          : null;

      const modules = await Module.find({ key: { $in: client.modules }, deleted: false });
      modules.forEach((item) => mod.push(getModuleData(item)));

      const profile = await Profile.findById(user.profile);

      if (!profile) return res.status(400).send({ status: errors.UNEXPECTED_ERROR });
      else {
        res.send({
          status: "OK",
          user,
          modules: mod,
          admin: { user: client.userAdmin, profile: client.profileAdmin },
          permissions: getPermissionsData(profile.permissions),
          name: client.name,
          logo: client.logoUrl,
          theme,
        });
      }
    }
  } catch (error) {
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/login", async (req, res) => {
  let dataPost = {
    ...req.body,
    username: req.body.username ? req.body.username.toLowerCase() : "",
  };

  const { error, value } = baseValidation.loginValidation(req.body);

  if (error) return res.status(400).send({ status: "ERROR", errors: formatJoiErrors(error.details) });
  else {
    try {
      const user = await User.findOne({ username: dataPost.username, password: md5(dataPost.password), deleted: false });

      if (!user) res.status(400).send({ status: "ERROR", errors: { password: { error: true, keyHelperText: errors.WRONG_DATA } } });
      else {
        if (!user.active) return res.status(400).send({ status: errors.USER_NO_ACTIVE });
        const profile = await Profile.findById(user.profile);
        if (!profile) return res.status(400).send({ status: errors.UNEXPECTED_ERROR });
        if (!profile.active) return res.status(400).send({ status: errors.PROFILE_NO_ACTIVE });
        const client = await Client.findOne({ key: user.keyClient });
        if (!client) return res.status(400).send({ status: errors.UNEXPECTED_ERROR });
        if (!client.active) return res.status(400).send({ status: errors.CLIENT_NO_ACTIVE });

        let data = getItemData(user, true);
        let session = req.session;
        session.user = data;
        req.session.save();
        res.send({ status: "OK", data });
      }
    } catch (error) {
      res.status(400).send({ status: "ERROR", errors: { password: { error: true, keyHelperText: errors.UNEXPECTED_ERROR } } });
    }
  }
});

router.post("/logout", async (req, res) => {
  let session = req.session;
  if (session && session.user) delete session.user;

  res.send({ status: "OK" });
});

function getModuleData(mod) {
  let data = mod.toObject();
  delete data._id;
  return data;
}

function getPermissionsData(permissions) {
  let permissionsData = {};
  permissions.forEach((item) => {
    permissionsData[item.keyModule] = item.options;
  });
  return permissionsData;
}

module.exports = router;
