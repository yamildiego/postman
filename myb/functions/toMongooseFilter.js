const toMongooseFilter = (gridFilterModel) => {
  const mongooseFilter = {};
  const conditions = gridFilterModel.map((filter) => {
    if (filter.value) {
      switch (filter.operator) {
        case "equals":
        case "=":
          return { [filter.column]: filter.value };
        case ">":
          return { [filter.column]: { $gt: filter.value } };
        case ">=":
          return { [filter.column]: { $gte: filter.value } };
        case "<":
          return { [filter.column]: { $lt: filter.value } };
        case "<=":
          return { [filter.column]: { $lte: filter.value } };
        case "!=":
          return { [filter.column]: { $ne: filter.value } };
        case "isEmpty":
          return { [filter.column]: { $in: [null, ""] } };
        case "isNotEmpty":
          return { [filter.column]: { $exists: true, $ne: "" } };
        case "startsWith":
          return { [filter.column]: { $regex: `^${filter.value}`, $options: "i" } };
        case "endsWith":
          return { [filter.column]: { $regex: `${filter.value}$`, $options: "i" } };
        case "contains":
          return { [filter.column]: { $regex: filter.value, $options: "i" } };
        case "true":
          return { [filter.column]: true };
        case "false":
          return { [filter.column]: false };
        default:
          return {};
      }
    } else return {};
  });

  if (conditions.length > 0) mongooseFilter[`$and`] = conditions;

  return mongooseFilter;
};

module.exports = toMongooseFilter;
