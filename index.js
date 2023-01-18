const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const routesApi = require("./src/routes/api");
const config = require("./src/constants/config");

let svr = config.IS_PRODUCTION ? "/server_1" : "";

const app = express();
app.use(express.json());
app.use(session({ secret: "8JyLd{C7fk]JF4Ha>", saveUninitialized: true, resave: true }));
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

app.use(`${svr}/api`, routesApi);

app.listen(5000, () => {
  console.log("Server has started!");
});
