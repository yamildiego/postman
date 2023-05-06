const express = require("express");
const router = express.Router();

const Rank = require("./../models/Rank");

router.get("/getRanking", async (req, res) => {
  const options = {
    page: 1,
    limit: 10,
    sort: { score: -1 },
  };

  Rank.paginate({}, options, function (err, result) {
    let itemsData = [];

    result.docs.forEach((doc) => itemsData.push(getItemData(doc)));

    res.send({ status: "OK", items: itemsData });
  });
});

router.post("/new", async (req, res) => {
  let dataPost = { ...req.body };
  let dataRank = { name: dataPost.name, lvl: dataPost.lvl, score: dataPost.score };
  let rank = new Rank(dataRank);

  rank.save().then(() => res.send({ status: "OK", item: dataRank }));
});

function getItemData(item) {
  let data = item.toObject();
  return data;
}

module.exports = router;
