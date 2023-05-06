const Profile = require("../models/Profile");
const User = require("../models/User");
const Client = require("../models/Client");
const Module = require("../models/Module");
const Product = require("../models/Product");
const { ObjectId } = require("mongodb");

const getClass = (mod) => {
  switch (mod) {
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
    case "products":
      return Product;
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
    case "profiles":
      item = new Profile({
        name: dataPost.name,
        active: dataPost.active !== undefined ? dataPost.active : true,
        keyClient,
        deleted: false,
      });
      return item;
      break;
    case "users":
      item = new User({
        username: dataPost.username,
        profile: dataPost.profile ? ObjectId(dataPost.profile) : null,
        name: dataPost.name,
        lastname: dataPost.lastname,
        email: dataPost.email,
        password: dataPost?.password ?? undefined,
        active: dataPost.active !== undefined ? dataPost.active : true,
        keyClient,
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
        keyClient,
        deleted: false,
      });
      return item;
      break;
    case "products":
      item = new Product({
        ...dataPost,
        keyClient,
        active: dataPost.active !== undefined ? dataPost.active : true,
        deleted: false,
      });
      return item;
      break;
    default:
      return null;
      break;
  }
};

exports.getNewItem = getNewItem;
