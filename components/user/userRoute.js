const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport/passport');
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const UsersController = require('../user/userController');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

// User Routes
router.route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
  .post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);

router.route('/secret')
  .get(passportJWT, UsersController.secret);

router.route('/edituser')
  .put(validateBody(schemas.authSchema), passportSignIn, UsersController.editUser);

module.exports = router;
