const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const config = require("../../config");
const stripe = require("stripe")(config.STRIPE_SK);

router.get("/", async (req, res) => {
  res.send({ status: "OKs" });
});

router.post("/create-checkout-session", async (req, res) => {
  let dataPost = { ...req.body };
  let line_items = dataPost.items;

  let order = new Order({ ...dataPost });

  order.save().then((savedDoc) => {
    if (!dataPost.freeShipping) line_items.push({ price: config.SHIPPING_PRICE, quantity: 1 });
    stripe.checkout.sessions
      .create({
        line_items,
        mode: "payment",
        success_url: `${config.DOMAIN}/success`,
        cancel_url: `${config.DOMAIN}/canceled`,
      })
      .then(
        (response, err) => {
          res.send({ status: "OK", url: response.url, orderNumber: savedDoc._id });
        },
        (err, response) => {
          res.send({ status: "ERROR" });
        }
      );
  });
});

module.exports = router;
