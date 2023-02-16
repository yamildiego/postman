const Config = require("../constants/Config");
const Errors = require("../constants/Errors");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Client = require("../models/Client");

module.exports = (dataPost, session, url, callback) => {
  let status = "OK";
  let userData = null;

  if (session.user)
    User.findById(session.user._id, (err, user) => {
      if (err) status = Errors.UNEXPECTED_ERROR;
      else {
        userData = getItemData(user);
        if (!user) status = Errors.SESSION_EXPIRED;
        else if (!user.active) status = Errors.USER_NO_ACTIVE;

        if (userData === null) status = Errors.UNEXPECTED_ERROR;

        if (!user.keyClient) {
          if (session.user.profile !== Config.ID_SUPERADMIN) status = Errors.NO_KEY_CLIENT;
        } else {
          // if (session.user.profile !== Config.ID_SUPERADMIN && user.keyClient !== dataPost.keyClient &&)
          // status = Errors.WRONG_KEY_CLIENT;
        }
        // if (url !== "/api/loadClient" && !dataPost.keyClient && !user.keyClient) status = Errors.UNDEFINED_KEY_CLIENT;

        if (status === "OK") {
          Profile.findById(user.profile, (err, profile) => {
            if (!profile) {
              status = Errors.UNEXPECTED_ERROR;
              callback({ status, user: null });
            } else {
              if (!profile.active) status = Errors.PROFILE_NO_ACTIVE;
              if (status === "OK") {
                Client.find({ key: profile.keyClient }, (err, client) => {
                  if (client.length < 1) status = Errors.UNEXPECTED_ERROR;
                  else if (!client[0].active) status = Errors.CLIENT_NO_ACTIVE;
                  callback({ status, user: status === "OK" ? userData : null });
                });
              } else callback({ status, user: null });
            }
          });
        } else callback({ status, user: null });
      }
    });
  else callback({ status: Errors.SESSION_EXPIRED, user: userData });
};

function getItemData(item) {
  if (item) {
    let data = item.toObject();
    delete data.password, delete data.__v;
    return data;
  } else return null;
}
