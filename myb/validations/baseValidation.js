const Joi = require("joi");

exports.loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data, { allowUnknown: true, abortEarly: false });
};
