const router = require('express-promise-router')();
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const equipoController = require('./equipoController');
const middlewareAuth = require('../../middleware/auth');

// Equipo Routes
router.route('/createquipo')
  .post(validateBody(schemas.equipoSchema),
    middlewareAuth.ensureAuth, equipoController.create);







/* link prueba middleware */
router.route('/probando-middleware-equipo')
  .get(middlewareAuth.ensureAuth, equipoController.pruebas);

module.exports = router;
