const jwt = require('jsonwebtoken');
const moment = require('moment');
const { JWT_SECRET } = require('../configuration');


/** PENDIENTE PARA VALIDACION */
module.exports = {
  ensureAuth: async (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(403).send({ message: 'La peticion no tiene la cabecera de autenticacion' });
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');
    try {
      const payload = jwt.decode(token, JWT_SECRET);
      if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token ha expirado' });
      }
      req.user = payload;
    } catch (error) {
      console.log(error);
      return res.status(404).send({ message: 'Token no válido' });
    }
    return next();
  },


  isAdmin: async (req, res, next) => {
    if (req.user.roleUser !== 'ROLE_ADMIN') {
      console.log(req.user.roleUser);
      return res.status(200).send({ message: 'No tienes autorizacion' });
    }
    return next();
  },
};
