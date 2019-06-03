const router = require('express-promise-router')();

function mainHandler(req, res) {
  throw new Error('My first error!');
}

// Link de pruebas.......
router.route('/debug-sentry')
  .get(mainHandler);

module.exports = router;
