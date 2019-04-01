const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const hash = require('../bcrypt');
const User = require('./user');
const signJwt = require('../jwt');

module.exports = {
  signUp: async (req, res) => {
    try {
      const {
        email,
        password,
        fullname,
        roleUser,
        equipo,
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
        equipo,
      });

      await newUser.save();

      // Generate the token
      const token = await signJwt.signToken(newUser);
      // Respond with token
      return res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Error signUp' });
    }
  },

  signIn: async (req, res, next) => {
    try {
      // Generate token
      const token = await signJwt.signToken(req.user);
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
        equipo,
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
        equipo,
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

  pruebas: async (req, res, next) => {
    try {
      // Check if there is a user with the same email
      const foundUserEquipo = await User.findOne({ 'local.email': 'jperez@gmail.com' }).populate('equipo');
      if (foundUserEquipo) {
        console.log(foundUserEquipo);
        return res.status(200).json({ message: 'ñiooooo' });
      }
      return next();
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: 'El terrible error!!!' });
    }
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


  /*  ******************* PENDIENTE *******************

    Pendiente el reset de la contraseña
    - Permite solicitar reset de contraseña con formulario de email
    - Si encuentra el email en la bd, emvia un correo con un token
    unico generado de una sola validez
    - Pendiente formulario de nueva pass y update para luegi enviar
    un email de que la pass cambio.
   */

  /* Form forgotpassword only for test api */
  getForgot: async (req, res) => {
    try {
      return res.send('<h2>Forgot Password</h2><form action="/api/v1/forgot" method="POST">'
        + '<input type="email" name="email" value="" placeholder="Enter your email address..." />'
        + '<input type="submit" value="Reset Password" />'
        + '</form>');
    } catch (error) {
      return error;
    }
  },

  postForgot: async (req, res, next) => {
    try {
      if (req.body.email !== undefined) {
        const { email } = req.body;
        const foundUser = await User.findOne({ 'local.email': email });
        if (!foundUser) {
          return res.status(403).json({ message: 'Usuario no existe' });
        }
        const { id, local: { password }, createdAt } = foundUser;
        const payload = {
          id,
          email,
        };
        const secret = `${password}-${createdAt}`;
        const token = await signJwt.signTokenForgot(payload, secret);
        foundUser.passResetKey = token;
        foundUser.passKeyExpires = Date.now() + 3600000;
        foundUser.save();
        res.json({ message: 'RESETPASS' });
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
        await transport.sendMail(mailOptions);
        res.send(`<a href="/api/v1/resetpassword/${payload.id}/${token}">Reset password</a>`);
      } else {
        return res.send('Email address is missing.');
      }
      return next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: 'Error sending the password reset message. Please try again shortly.' });
    }
  },
};
