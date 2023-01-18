const dotenv = require("dotenv").config();
module.exports = {
  IS_PRODUCTION: true,
  ALLOWED_ORIGINS: [process.env.ORIGIN_0, process.env.ORIGIN_1, process.env.ORIGIN_2, process.env.ORIGIN_3],
};
