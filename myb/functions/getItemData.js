const { assign } = require("lodash");

const getItemData = (item, keepkeyClient) =>
  assign(
    {},
    {
      ...item._doc,
      password: undefined,
      deleted: undefined,
      keyClient: keepkeyClient === true ? item._doc.keyClient : undefined,
      __v: undefined,
    }
  );

module.exports = getItemData;
