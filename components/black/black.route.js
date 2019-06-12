const router = require('express-promise-router')();
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const blackControlller = require('./black.controller');
const middlewareAuth = require('../../middleware/auth');

// Black Routes

router.route('/black')
  .post(blackControlller.getBlack);

module.exports = router;
