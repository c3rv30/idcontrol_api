const passport = require('passport');
const passportConf = require('../components/passport/passport');

const localAuth = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

module.exports = {
  localAuth,
  passportJWT,
};
