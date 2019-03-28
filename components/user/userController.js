const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const hash = require('../bcrypt');
const User = require('./user');
const { JWT_SECRET } = require('../../configuration');





/** MODULARIZAR saxjhhsujadjhusahjksa */
function signToken(user) {
  return JWT.sign({
    role: user.roleUser,
    name: user.fullname,
    iss: 'shtspa22',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
  }, JWT_SECRET);
}


module.exports = {
  signUp: async (req, res) => {
    const {
      email,
      password,
      fullname,
      roleUser,
    } = req.value.body;

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ 'local.email': email });
    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use' });
    }

    // Create a new user
    const newUser = new User({
      method: 'local',
      local: {
        email,
        password,
      },
      fullname,
      roleUser,
    });

    await newUser.save();

    // Generate the token
    const token = signToken(newUser);
    // Respond with token
    return res.status(200).json({ token });
  },

  signIn: async (req, res, next) => {
    try {
      // Generate token
      const token = signToken(req.user);
      return res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      next();
      return res.status(403).json({ error: 'Error signIn' });
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const userID = req.params.id;
      let { password } = req.value.body;
      const {
        email,
        fullname,
        roleUser,
      } = req.value.body;

      const pass = password;
      const passwordHash = await hash.genHash(pass);
      password = passwordHash;
      const updateUser = {
        method: 'local',
        local: {
          email,
          password,
        },
        fullname,
        roleUser,
      };

      if (userID !== req.user.sub) {
        return res.status(500).json({ message: 'No tienes permiso para actualizar usuario' });
      }

      console.log(updateUser);
      // Check if there is a user with the same email
      await User.findByIdAndUpdate(userID, updateUser, { new: true });

      if (updateUser) {
        return res.status(200).json({ succesful: 'Usuario editado' });
      }
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Error edit User' });
    }
    return next();
  },



  /* Form forgotpasswor */
  forgotpass: async (req, res) => {
    try {
      return res.send('<h2>Forgot Password</h2><form action="/api/v1/resetpass" method="POST">'
        + '<input type="email" name="email" value="" placeholder="Enter your email address..." />'
        + '<input type="submit" value="Reset Password" />'
        + '</form>');
    } catch (error) {
      return error;
    }
  },




  passwordreset: async (req, res, next) => {
    try {
      if (req.body.email !== undefined) {
        const { email } = req.body;

        // TODO: Using email, find user from your database.
        // Check if there is a user with the same email
        const foundUser = await User.findOne({ 'local.email': email });
        if (!foundUser) {
          return res.status(403).json({ message: 'Usuario no encontrado' });
        }
        const { id } = foundUser;
        // eslint-disable-next-line prefer-destructuring
        const password = foundUser.local.password;
        const { createdAt } = foundUser;

        const payload = {
          id, // User ID from database
          email,
        };

        // TODO: Make this a one-time-use token by using the user's
        // current password hash from the database, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        // var secret = user.password + ‘-' + user.created.getTime();
        // const secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';
        // const token = JWT.encode(payload, secret);
        const secret = `${password}-${createdAt}`;
        const token = JWT.sign(payload, secret);

        foundUser.passResetKey = token;
        foundUser.passKeyExpires = Date.now() + 3600000;
        foundUser.save();
        res.json({ message: 'RESETPASS' });
        // TODO: Send email containing link to reset password.
        // In our case, will just return a link to click.

        const transport = nodemailer.createTransport(
          nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY,
          }),
        );
        const mailOptions = {
          to: email,
          from: 'soporte@smarthub.cl',
          subject: 'Reset your password on IDCONTROL',
          text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/api/v1/resetpass/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };
        transport.sendMail(mailOptions);
          /* .then(() => {
            res.status(200).send({ msg: `An e-mail has been sent to ${email} with further instructions.` });
          })
          .catch((err) => {
            console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
            res.status(403).send({ msg: 'Error sending the password reset message. Please try again shortly.' });
            return err;
          });
          */
        // res.send(`<a href="/resetpassword/${payload.id}/${token}">Reset password</a>`);
      } else {
        res.send('Email address is missing.');
      }
      return next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: 'Error remove user' });
    }
  },






  /* Logout sesion */
  logout: async (req, res) => {
    try {
      req.logOut();
      console.log(req.user);
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  },

  secret: async (req, res) => {
    console.log('I managed to get here!');
    res.json({ secret: 'resource' });
  },

  pruebas: async (req, res) => {
    res.status(200).send({ message: 'Probando controlador de usuarios', user: req.user });
  },

  /* Delete User */
  deleteUser: async (req, res, next) => {
    try {
      const userID = req.params.id;

      if (userID !== req.user.sub) {
        return res.status(500).json({ message: 'No tienes permiso para actualizar usuario' });
      }

      const userRemoved = await User.findByIdAndRemove(userID, { new: true });

      if (userRemoved) {
        return res.status(200).json({ message: 'Usuario Eliminado' });
      }
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: 'Error remove user' });
    }
    return next();
  },
};
