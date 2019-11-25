const router = require('express-promise-router')();
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const asistenteController = require('./asistente.controller');
const middlewareAuth = require('../../middleware/auth');

// Asistente Routes

router.route('/asiscounts')
  .post(middlewareAuth.ensureAuth, asistenteController.asisCounter);

// Get asistente by rut and optional date
router.route('/getasis')
  .post(middlewareAuth.ensureAuth, asistenteController.getAsisByRutDate);

// Get asistentes current month
router.route('/getasismonth')
  .post(middlewareAuth.ensureAuth, asistenteController.getTotAsisMonth);

// Get all asistentes from current year
router.route('/getasisyear')
  .post(middlewareAuth.ensureAuth, asistenteController.getTotAsisCurrentYear);

// Get total asistentes
router.route('/getallasis')
  .post(middlewareAuth.ensureAuth, asistenteController.getTotAsis);

// Get total asistentes
router.route('/export')
  .post(middlewareAuth.ensureAuth, asistenteController.exportPartido);


// Link de pruebas.......
router.route('/pruebaFechas')
  .get(asistenteController.pruebaasis);

// Link de pruebas.......
router.route('/testretrofit')
  .get(asistenteController.retrofit);

module.exports = router;
