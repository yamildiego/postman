const dotenv = require("dotenv").config();

module.exports = {
  CONNECTION: process.env.MONGODB_CONNECTION,
  ALLOWED_ORIGINS: [
    process.env.ORIGIN_0,
    process.env.ORIGIN_1,
    process.env.ORIGIN_2,
    process.env.ORIGIN_3,
    process.env.ORIGIN_4,
    process.env.ORIGIN_5,
  ],
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  RECEIVER: process.env.RECEIVER,
};
