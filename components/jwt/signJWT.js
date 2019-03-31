const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../../configuration');

module.exports = {
  signToken: (user) => {
    try {
      return JWT.sign({
        role: user.roleUser,
        name: user.fullname,
        iss: 'shtspa22',
        sub: user.id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
      }, JWT_SECRET);
    } catch (error) {
      console.log(error);
      return (error);
    }
  },

  signTokenForgot: (payload, secret) => {
    try {
      return JWT.sign(payload, secret);
    } catch (error) {
      return (error);
    }
  },
};
