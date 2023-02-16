const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
var ObjectId = require("mongodb").ObjectID;

router.post("/getProduct", async (req, res) => {
  let dataPost = { ...req.body };
  Product.find({ cloudProductId: dataPost.cloudProductId }, (err, docs) => {
    let item = null;
    if (docs.length > 0) item = docs[0];

    let filter = getFilter(dataPost);

    Product.findRandom(filter, {}, { limit: 12 }, (err, recomendationsDocs) => {
      let recomendations = [];
      recomendations = recomendationsDocs.filter((recomendationsDoc) => recomendationsDoc.cloudProductId !== item.cloudProductId);

      if (recomendations.length < 12) {
        Product.findRandom({}, {}, { limit: 13 - recomendations.length }, (err, docsRandom) => {
          let recomendationsRandom = [];
          if (!err) {
            recomendationsRandom = docsRandom.filter((docRan) => docRan.cloudProductId !== item.cloudProductId);

            res.send({ status: "OK", item, recomendations: [...recomendations, ...recomendationsRandom] });
          } else res.send({ status: "OK", item, recomendations: [] });
        });
      } else res.send({ status: "OK", item, recomendations });
    });
  });
});

router.post("/", async (req, res) => {
  let dataPost = { ...req.body };

  let options = getOptions(dataPost, 24);

  let filter = getFilter(dataPost);

  Product.paginate(filter, options, (err, result) => {
    let itemsData = [];

    result.docs.forEach((doc) => itemsData.push(doc));

    res.send({ status: "OK", items: itemsData, totalPages: result.totalPages });
  });
});

function getFilter(dataPost) {
  let realFilters = [
    { $or: [{ title: { $regex: dataPost.search, $options: "i" } }, { subtitle: { $regex: dataPost.search, $options: "i" } }] },
  ];
  let filterPrice = { currentPrice: { $gt: dataPost.filter.price[0], $lt: dataPost.filter.price[1] } };
  realFilters.push(filterPrice);

  if (dataPost.filter["kids"].length > 0) realFilters.push({ genders: { $in: dataPost.filter["kids"] } });
  else {
    if (dataPost.filter["gender"].includes("MEN")) realFilters.push({ genders: { $in: ["MEN"] } });
    if (dataPost.filter["gender"].includes("WOMEN")) realFilters.push({ genders: { $in: ["WOMEN"] } });
    if (dataPost.filter["gender"].includes("UNISEX"))
      realFilters.push({
        $or: [{ $and: [{ genders: "MEN" }, { genders: "WOMEN" }] }, { $and: [{ genders: "BOYS" }, { genders: "GIRLS" }] }],
      });
  }

  if (dataPost.filter["category"].length > 0) realFilters.push({ category: { $in: dataPost.filter["category"] } });
  if (dataPost.filter["onSale"] && dataPost.filter["onSale"].length > 0) realFilters.push({ isOnSale: true });

  return { $and: realFilters };
}

const getOptions = (dataPost, limit) => {
  let projection = {
    _id: 1,
    cloudProductId: 1,
    title: 1,
    subtitle: 1,
    category: 1,
    genders: 1,
    currentPrice: 1,
    fullPrice: 1,
    priceId: 1,
    colorways: 1,
    skuData: 1,
    images: 1,
    isOnSale: 1,
    active: 1,
    deleted: 1,
  };

  return {
    page: dataPost.filter.page ? dataPost.filter.page : 1,
    limit,
    sort: dataPost.sort ? dataPost.sort : {},
    projection,
  };
};

module.exports = router;
