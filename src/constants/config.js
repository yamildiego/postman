const dotenv = require("dotenv").config();
module.exports = {
  CONNECTION: process.env.MONGODB_CONNECTION,
  ALLOWED_ORIGINS: [process.env.ORIGIN_0, process.env.ORIGIN_1, process.env.ORIGIN_2, process.env.ORIGIN_3],
};
