const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    fallback: {
      async_hooks: false,
    },
  },
  mode: "production",
  target: "node",
  performance: {
    hints: false,
  },
  externals: [
    nodeExternals({
      allowlist: [
        "express",
        "express-session",
        "body-parser",
        "cors",
        "mongoose",
        "md5",
        "lodash",
        "dotenv",
        "nodemailer",
        "mongoose-paginate-v2",
        "mongoose-simple-random",
        "joi",
        "mongodb",
      ],
    }),
  ],
};
