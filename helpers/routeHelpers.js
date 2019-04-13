const Joi = require('joi');

module.exports = {
  validateBody: schema => (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(400).json(result.error);
    }

    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
    return true;
  },

  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().allow(null, ''),
      fullname: Joi.string(),
      roleUser: Joi.string(),
      equipo: Joi.string().allow(null, ''),
    }),
    equipoSchema: Joi.object().keys({
      name: Joi.string(),
      email: Joi.string().email(),
      dir: Joi.string(),
      ciudad: Joi.string(),
      comuna: Joi.string(),
      image: Joi.string().allow(null, ''),
    }),
  },
};
