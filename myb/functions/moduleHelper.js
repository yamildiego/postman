const Profile = require("../models/Profile");
const User = require("../models/User");
const Client = require("../models/Client");
const Module = require("../models/Module");
const Supplier = require("../models/Supplier");
const Brand = require("../models/Brand");
//ecommerce
const Product = require("../../ecommerce/models/Product");
const Unit = require("../models/Unit");
const { ObjectId } = require("mongodb");

const getClass = (mod) => {
  switch (mod) {
    case "units":
      return Unit;
      break;
    case "products":
      return Product;
      break;
    case "brands":
      return Brand;
      break;
    case "suppliers":
      return Supplier;
      break;
    case "profiles":
      return Profile;
      break;
    case "users":
      return User;
      break;
    case "clients":
      return Client;
      break;
    case "modules":
      return Module;
      break;
    default:
      return null;
      break;
  }
};

exports.getClass = getClass;

const getNewItem = (mod, dataPost, keyClient = "") => {
  let item = null;
  switch (mod) {
    case "products":
      item = new Product({
        cloudProductId: dataPost.cloudProductId,
        title: dataPost.title,
        subtitle: dataPost.subtitle,
        category: dataPost.category,
        genders: dataPost.genders,
        currentPrice: dataPost.currentPrice,
        fullPrice: dataPost.fullPrice,
        priceId: dataPost.priceId,
        keyClient,
        active: true,
        deleted: false,
      });
      return item;
      break;
    case "units":
      item = new Unit({
        title: dataPost.title,
        lvl: dataPost.lvl,
        exercises: [],
        keyClient,
        active: false,
        deleted: false,
      });
      return item;
      break;
    case "suppliers":
      item = new Supplier({
        name: dataPost.name,
        keyClient,
        active: true,
        deleted: false,
      });
      return item;
      break;
    case "brands":
      item = new Brand({
        name: dataPost.name,
        keyClient,
        active: true,
        deleted: false,
      });
      return item;
      break;
    case "profiles":
      item = new Profile({
        name: dataPost.name,
        keyClient,
        active: true,
        deleted: false,
      });
      return item;
      break;
    case "users":
      item = new User({
        user: dataPost.user,
        profile: dataPost.profile ? ObjectId(dataPost.profile) : null,
        name: dataPost.name,
        lastname: dataPost.lastname,
        email: dataPost.email,
        keyClient,
        active: true,
        expiration_date: Date.now() + 2628002880,
        deleted: false,
      });
      return item;
      break;
    case "clients":
      item = new Client({
        name: dataPost.name,
        key: dataPost.key,
        expiration_date: dataPost.expiration_date,
        logoUrl: dataPost.logoUrl,
        admin: dataPost.admin ? ObjectId(dataPost.admin) : null,
        modules: dataPost.modules,
        theme: {
          // palette: {
          //   primary: {
          //     main: "#ff7661",
          //     dark: "#e51b1a",
          //     light: "#ffc5ba",
          //     contrastText: "#FFF",
          //   },
          //   secondary: {
          //     main: "#7661ff",
          //     dark: "#2338ed",
          //     light: "#b5a5fe",
          //     contrastText: "#FFF",
          //   },
          // },
        },
        active: true,
        deleted: false,
      });
      return item;
      break;
    case "modules":
      item = new Module({
        key: dataPost.key,
        name_en: dataPost.name_en,
        name_es: dataPost.name_es,
        mainFunction: dataPost.mainFunction,
        icon: dataPost.icon,
      });
      return item;
      break;
    default:
      return null;
      break;
  }
};

exports.getNewItem = getNewItem;
