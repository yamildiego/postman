const User = require("../models/User");
const Profile = require("../models/Profile");
const Client = require("../models/Client");

const getItemData = require("../functions/getItemData");

const errors = require("../constants/errors");

module.exports = async (dataPost, res, req, callback) => {
  if (req.url !== "/api/login" && req.url !== "/api/logout") {
    let userSession = req.session.user;
    try {
      if (!userSession) return res.status(400).send({ status: errors.SESSION_EXPIRED });

      const user = await User.findById(userSession._id);
      if (!user) return res.status(400).send({ status: errors.UNEXPECTED_ERROR });
      if (!user.active) return res.status(400).send({ status: errors.USER_NO_ACTIVE });

      const profile = await Profile.findById(user.profile);
      if (!profile) return res.status(400).send({ status: errors.UNEXPECTED_ERROR });
      if (!profile.active) return res.status(400).send({ status: errors.PROFILE_NO_ACTIVE });

      const client = await Client.findOne({ key: user.keyClient });
      if (!client) return res.status(400).send({ status: errors.UNEXPECTED_ERROR });
      if (!client.active) return res.status(400).send({ status: errors.CLIENT_NO_ACTIVE });

      userData = getItemData(user);

      if (userData === null) return res.status(400).send({ status: errors.UNEXPECTED_ERROR });
      else callback();
    } catch (error) {
      return res.status(400).send({ status: errors.UNEXPECTED_ERROR });
    }
  } else callback();
};
