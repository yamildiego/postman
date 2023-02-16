const express = require("express");
const router = express.Router();
const md5 = require("md5");

const User = require("../models/User");
const Config = require("../constants/Config");

router.post("/assignPassword", async (req, res) => {
  let dataPost = { ...req.body };
  let initFilter = { deleted: false };
  let isSuperAdmin = req.session.user.profile == Config.ID_SUPERADMIN;
  if (!isSuperAdmin) initFilter["keyClient"] = dataPost.keyClient;
  let optionsParams = { page: dataPost.page ? dataPost.page : 1 };
  let options = optionsParams.page !== -1 ? { limit: 8, ...optionsParams } : {};

  User.findByIdAndUpdate(dataPost.id, { password: md5(dataPost.password) }, { new: true }, (err, itemUpdated) => {
    User.paginate(initFilter, options, (err, result) => {
      let itemsData = [];
      result.docs.forEach((item) => itemsData.push(getItemData(item)));

      res.send({ status: "OK", items: itemsData, totalPages: result.totalPages, totalItems: result.totalDocs });
    });
  });
});

function getItemData(item) {
  let data = item.toObject();
  delete data.password;
  return data;
}

module.exports = router;
