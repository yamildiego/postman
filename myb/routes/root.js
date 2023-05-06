const express = require("express");
const router = express.Router();
const createSchema = require("../functions/createSchema");

router.get("/", async (req, res) => {
  const field = {
    _id: { $oid: "6436d5cd944d4d9260cc354a" },
    key: "products",
    name_en: "Products",
    name_es: "Productos",
    icon: "",
    mainFunction: "list",
    keyClient: "SAM",
    deleted: false,
    options: [
      { key: "list", title: { en: "List products", es: "Listar productos" }, _id: { $oid: "6436dbfeb99ee05857032113" } },
      { key: "add", title: { en: "Add product", es: "Agregar producto" }, _id: { $oid: "6436dbfeb99ee05857032114" } },
      { key: "edit", title: { en: "Edit product", es: "Editar producto" }, _id: { $oid: "6436dbfeb99ee05857032115" } },
      {
        key: "status",
        title: { en: "Activate/block product", es: "Dar de alta/baja un producto" },
        _id: { $oid: "6436dbfeb99ee05857032116" },
      },
      { key: "delete", title: { en: "Delete product", es: "Borrar producto" }, _id: { $oid: "6436dbfeb99ee05857032117" } },
    ],
    fields: [
      {
        key: "code",
        name: { en: "Code", es: "Codigo" },
        typew: "text",
        defaultValue: "",
        disabled: ["edit"],
        visible: ["add", "edit"],
        validations: ["unique", "required"],
        _id: { $oid: "643760a90d59c4d299d1bb0d" },
      },
      {
        key: "title",
        name: { en: "Title", es: "Título" },
        typew: "text",
        defaultValue: "",
        disabled: [],
        visible: ["list", "add", "edit"],
        validations: ["required"],
        _id: { $oid: "643760a90d59c4d299d1bb0e" },
      },
      {
        key: "subtitle",
        name: { en: "Subtitle", es: "Subtítulo" },
        typew: "textarea",
        defaultValue: "",
        disabled: [],
        visible: ["list", "add", "edit"],
        validations: ["required"],
        _id: { $oid: "643760a90d59c4d299d1bb0f" },
      },
      {
        key: "price",
        name: { en: "Price", es: "Precio" },
        typew: "money",
        defaultValue: "",
        disabled: [],
        visible: ["list", "add", "edit"],
        validations: ["required"],
        _id: { $oid: "643760a90d59c4d299d1bb10" },
      },
      {
        key: "category",
        name: { en: "Category", es: "Categoria" },
        typew: "select",
        defaultValue: "APPAREL",
        values: { APPAREL: "APPAREL", FOOTWEAR: "FOOTWEAR", EQUIPMENT: "EQUIPMENT" },
        disabled: [],
        visible: ["list", "add", "edit"],
        validations: ["required"],
        _id: { $oid: "643760a90d59c4d299d1bb11" },
      },
      {
        key: "release_date",
        name: { en: "Release date", es: "Fecha de lanzamiento (temp type text)" },
        typew: "date",
        defaultValue: "NOW",
        disabled: [],
        visible: ["list", "add", "edit"],
        validations: [],
        _id: { $oid: "643760a90d59c4d299d1bb12" },
      },
      {
        key: "genders",
        name: { en: "Genders", es: "Genero" },
        typew: "autocomplete",
        defaultValue: "",
        values: { MEN: "Men", WOMEN: "Women", BOYS: "Boys", GIRLS: "Girls" },
        isMultiple: true,
        disabled: ["edit"],
        visible: ["list", "add", "edit"],
        validations: [],
        _id: { $oid: "643760a90d59c4d299d1bb13" },
      },
      {
        key: "active",
        name: { en: "Status", es: "Estado" },
        typew: "boolean",
        defaultValue: "true",
        disabled: [],
        visible: ["list"],
        validations: [],
        _id: { $oid: "643760a90d59c4d299d1bb14" },
      },
    ],
    __v: 0,
  };

  createSchema("Brand", {
    name: { type: String, required: false },
    date_created: Date,
    algo: Number,
    active: Boolean,
    keyClient: String,
    deleted: Boolean,
  });
  res.send({ status: "OK" });
});

module.exports = router;
