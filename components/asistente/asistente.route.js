const router = require('express-promise-router')();
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const asistenteController = require('./asistente.controller');
const middlewareAuth = require('../../middleware/auth');

// Asistente Routes

/* router.route('/get-asistentes')
  .get(middlewareAuth.ensureAuth, asistenteController.pruebas); */

/* link prueba middleware */
// router.route('/probando-middleware-asistente')
//  .get(middlewareAuth.ensureAuth, asistenteController.pruebas);

router.route('/asiscounts')
  .post(middlewareAuth.ensureAuth, asistenteController.asisCounter);

router.route('/getasis')
  .post(middlewareAuth.ensureAuth, asistenteController.getAsisByRutDate);

router.route('/pruebaFechas')
  .get(asistenteController.getTotAsisMonth);

module.exports = router;
