const nodemailer = require("nodemailer");
const getHTML = require("../emails/getHTML");

module.exports = async (website, from) => {
  let transporter = nodemailer.createTransport(website.emailSender);
  return transporter.sendMail({
    from: `${website.name} <${website.emailSender.auth.user}>`,
    to: "yamildiego@gmail.com",
    subject: `Email from ${from.email}`,
    html: getHTML(website, from),
  });
};
