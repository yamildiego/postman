const fs = require("fs");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const random = require("mongoose-simple-random");

function createSchema(nameModule, properties) {
  console.log(JSON.stringify(properties));
  // const schemaContent = `
  //   const mongoose = require('mongoose');
  //   const mongoosePaginate = require('mongoose-paginate-v2');
  //   const random = require('mongoose-simple-random');
  //   const ${nameModule}Schema = mongoose.Schema(${JSON.stringify(properties, null, 2).replace(/\"([^(\")"]+)\":/g, "$1:")});
  //   ${nameModule}Schema.plugin(mongoosePaginate);
  //   ${nameModule}Schema.plugin(random);

  //   module.exports = mongoose.model('${nameModule}', ${nameModule}Schema);
  // `;
  // fs.writeFileSync(`${nameModule}.js`, schemaContent);
}

module.exports = createSchema;
