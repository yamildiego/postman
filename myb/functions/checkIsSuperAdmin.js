const Config = require("../constants/Config");

module.exports = (res, user, callback) => {
  let isSuperAdmin = user.profile == Config.ID_SUPERADMIN;

  if (isSuperAdmin) callback();
  else res.send({ status: "NO_LEVEL_OF_ACCESS" });
};
