const passport = require('passport');
const passportConf = require('../components/passport/passport');

// const localAuth = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

const localAuth = (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    // this will execute in any case, even if a passport strategy will find an error
    // log everything to console
    console.log(error);
    console.log(user);
    console.log(info);

    if (error) {
      res.status(401).send(error);
    } else if (!user) {
      res.status(401).send(info);
    } else {
      next();
    }
    res.status(401).send(info);
  })(req, res);
};

module.exports = {
  localAuth,
  passportJWT,
};
