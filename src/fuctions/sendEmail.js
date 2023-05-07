const nodemailer = require("nodemailer");
const getHTML = require("../emails/getHTML");
const config = require("../constants/config");
const websites = require("../../websites.json");

module.exports = async (website_key, from) => {
  const mailConfig = {
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    auth: {
      user: config.SMTP_USERNAME,
      pass: config.SMTP_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(mailConfig);
  transporter.verify().then(console.log).catch(console.error);

  transporter
    .sendMail({
      from: `${websites[website_key].name} <${config.SMTP_USERNAME}>`,
      to: config.RECEIVER,
      subject: `Email from ${from.email}`,
      html: getHTML(websites[website_key], from),
    })
    .then((info) => {
      console.log({ info });
    })
    .catch(console.error);
};
