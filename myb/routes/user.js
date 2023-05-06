const express = require("express");
const router = express.Router();
const md5 = require("md5");

const User = require("../models/User");

const errors = require("../constants/errors");

router.post("/assignPassword", async (req, res) => {
  try {
    const { id, password } = req.body;
    const { keyClient } = req.session.user;

    const itemUpdated = await User.findByIdAndUpdate(id, { password: md5(password) }, { new: true }).lean();

    if (!itemUpdated) res.status(400).send({ status: errors.ERROR_NO_UPDATED });
    else res.send({ status: "OK" });
  } catch (error) {
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

router.post("/updatePassword", async (req, res) => {
  try {
    const { id, current_password, new_password } = req.body;
    const { username, keyClient } = req.session.user;

    let user = await User.findOne({ _id: id, username, password: md5(current_password) }).lean();

    if (!user)
      res.status(400).send({ status: errors.ERROR_FORM, errors: { current_password: { error: true, keyHelperText: "WRONG_DATA" } } });
    else {
      await User.findByIdAndUpdate(id, { password: md5(new_password) }, { new: true }).lean();

      res.send({ status: "OK" });
    }
  } catch (error) {
    res.status(500).send({ status: errors.UNEXPECTED_ERROR });
  }
});

const paginateUsers = async (filter, options) => await User.paginate(filter, options);

module.exports = router;
