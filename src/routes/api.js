const express = require("express");
const router = express.Router();
const sendEmail = require("../fuctions/sendEmail");

const websites = [
  {
    emailSender: {
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "yamildiego91@gmail.com",
        pass: "uouam6tqvp",
      },
    },
    name: "VerdeAgostini",
    logo: "https://i.ibb.co/cvR5C5F/newlogox500-en-fw.png",
  },
  {
    emailSender: {
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "yamildiego91@gmail.com",
        pass: "uouam6tqvp",
      },
    },
    name: "TEDxVILLALAANGOSTURA",
    logo: "https://i.ibb.co/M2hWsbC/SNAG-0015.png",
  },
];

router.get("/", async (req, res) => {
  res.send({ status: "OK" });
});

router.post("/contact", async (req, res) => {
  let dataPost = { ...req.body };
  let from = { name: dataPost.name, phone: dataPost.phone, email: dataPost.email, message: dataPost.message };

  sendEmail(websites[dataPost.website], from).then(() => {
    res.send({ status: "OK" });
  });
});

module.exports = router;
