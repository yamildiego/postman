const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const routesApi = require("./src/routes/api");

// sam
const mongoose = require("mongoose");
const routesApimyb = require("./myb/routes/api");
const routesClient = require("./myb/routes/client");
const routesModule = require("./myb/routes/module");
const routesProfile = require("./myb/routes/profile");
const routesUser = require("./myb/routes/user");

//game
const routesRank = require("./rank/routes/rank");

//ecommerce
const routesProducts = require("./ecommerce/routes/products");

const config = require("./src/constants/config");

mongoose.set("strictQuery", false);

mongoose.connect(config.CONNECTION, { useNewUrlParser: true }).then(() => {
  const app = express();
  app.use(express.json());
  app.use(session({ secret: "8JyLd{C7fk]JFSS", saveUninitialized: true, resave: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (config.ALLOWED_ORIGINS.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });

  //postman y otros
  app.use(`/`, routesApi);

  //ecommerce
  app.use(`/products`, routesProducts);

  // sam
  app.use(`/api`, routesApimyb);
  app.use(`/client`, routesClient);
  app.use(`/module`, routesModule);
  app.use(`/profile`, routesProfile);
  app.use(`/user`, routesUser);
  //game
  app.use(`/rank`, routesRank);

  const port = process.env.port || 5000;

  app.listen(port, () => {
    console.log(`Server has started! ${port}`);
  });
});
