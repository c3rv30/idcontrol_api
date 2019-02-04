const router = require('express-promise-router')();
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const UsersController = require('../user/userController');

// User Routes
router.route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
  .post(validateBody(schemas.authSchema), UsersController.signIn);

// router.route('/secret')
// .get(passportJWT, UsersController.secret);

module.exports = router;
