const Joi = require("joi");

exports.newClientValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    key: Joi.string().required(),
    name_profile: Joi.string().required(),
    name_user: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
  });

  return schema.validate(data, { allowUnknown: true, abortEarly: false });
};
