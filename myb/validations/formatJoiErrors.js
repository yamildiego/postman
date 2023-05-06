const formatJoiErrors = (errors) => {
  const formattedErrors = {};

  errors.forEach((error) => {
    const key = error.context.key;

    let keyHelperText = error.type.indexOf(".") === -1 ? error.type : error.type.split(".")[1];

    if (!formattedErrors[key] && keyHelperText !== "unknown") {
      formattedErrors[key] = { error: true, keyHelperText };
      if (keyHelperText === "min" || keyHelperText === "max")
        formattedErrors[key] = { ...formattedErrors[key], limit: error.context.limit };
    }
  });

  return formattedErrors;
};

module.exports = formatJoiErrors;
