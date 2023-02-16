const express = require("express");
const router = express.Router();
const md5 = require("md5");

const Profile = require("../models/Profile");
const Client = require("../models/Client");
const Module = require("../models/Module");
const User = require("../models/User");
const Config = require("./../constants/Config");

router.get("/", async (req, res) => {
  res.send({ status: "OK" });
});

router.post("/loadClients", async (req, res) => {
  let user = req.session.user;

  if (user.profile === Config.ID_SUPERADMIN) {
    Client.find({ deleted: false }, (err, items) => {
      let values = {};
      items.forEach((item) => {
        values[item.key] = item.name;
      });
      res.send({ status: "OK", values });
    });
  } else res.send({ status: "Errors.UNEXPECTED_ERROR" });
});

router.post("/reloadConfig", async (req, res) => {
  let dataPost = { ...req.body };
  let user = req.session.user;
  let mod = [];

  let keyClient = dataPost.keyClient ? dataPost.keyClient : user.keyClient;

  Client.find({ key: keyClient }, (err, elements) => {
    let client = elements[0];
    let theme =
      "theme" in client &&
      "palette" in client.theme &&
      "primary" in client.theme.palette &&
      "main" in client.theme.palette.primary &&
      client.theme.palette.primary.main
        ? client.theme
        : null;
    Module.find({ key: { $in: client.modules } }, (err, docs) => {
      docs.forEach((item) => {
        mod.push(getModuleData(item));
      });

      let permissions = [];

      if (user.profile == Config.ID_SUPERADMIN) {
        if (client.admin) {
          Profile.findById(client.admin, (err, profile) => {
            if (profile) permissions = getPermissionsData(profile.permissions);
            res.send({ status: "OK", user, modules: mod, permissions, name: client.name, logo: client.logoUrl, theme });
          });
        } else res.send({ status: "OK", user, modules: mod, permissions, name: client.name, logo: client.logoUrl, theme });
      } else {
        Profile.findById(user.profile, (err, profile) => {
          if (profile) permissions = getPermissionsData(profile.permissions);
          res.send({ status: "OK", user, modules: mod, permissions, name: client.name, logo: client.logoUrl, theme });
        });
      }
    });
  });
});

router.post("/login", async (req, res) => {
  let dataPost = {
    ...req.body,
    username: req.body.username ? req.body.username.toLowerCase() : "",
  };
  let errors = {};

  if (!dataPost.username) errors["username"] = { error: true, helperText: "required" };
  if (!dataPost.password) errors["password"] = { error: true, helperText: "required" };
  if (!dataPost.password) errors["password"] = { error: true, helperText: "required" };

  if (Object.keys(errors).length > 0) res.send({ status: "ERROR", errors });
  else {
    User.find({ $and: [{ user: dataPost.username, password: md5(dataPost.password), deleted: false }] }, (err, users) => {
      if (err) res.send({ status: "Errors.UNEXPECTED_ERROR" });
      if (users.length > 0) {
        let data = getItemData(users[0]);
        let session = req.session;
        session.user = data;
        req.session.save();
        res.send({ status: "OK", data });
      } else {
        errors["password"] = { error: true, helperText: "wrongData" };
        res.send({ status: "ERROR", errors });
      }
    });
  }
});

router.post("/logout", async (req, res) => {
  let session = req.session;
  if (session && session.user) delete session.user;

  res.send({ status: "OK" });
});

function getItemData(item) {
  let data = item.toObject();
  delete data.password, delete data.deleted, delete data.__v;
  return data;
}

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
