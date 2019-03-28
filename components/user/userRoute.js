const router = require('express-promise-router')();
const passport = require('passport');
require('../passport/passport');
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const UsersController = require('../user/userController');
const middlewareAuth = require('../../middleware/auth');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

// User Routes
router.route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/update-user/:id')
  .put(validateBody(schemas.authSchema),
    [middlewareAuth.ensureAuth], UsersController.updateUser);

router.route('/delete-user/:id')
  .delete([middlewareAuth.ensureAuth, middlewareAuth.isAdmin], UsersController.deleteUser);

router.route('/signin')
  .post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);

router.route('/logout')
  .get(middlewareAuth.ensureAuth, UsersController.logout);


  

router.route('/forgotpass')
  .get(UsersController.forgotpass);

router.route('/resetpass')
  .post(UsersController.passwordreset);




/* validate token */
router.route('/secret')
  .get(passportJWT, UsersController.secret);

/* link prueba middleware */
router.route('/probando-middleware')
  .get(middlewareAuth.ensureAuth, UsersController.pruebas);

module.exports = router;
