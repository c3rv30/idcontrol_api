const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../../configuration');
const User = require('./user');
const hash = require('../bcrypt');

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

  passwordreset: async (req, res, next) => {
    try {
      if (req.body.email !== undefined) {
        const emailAddress = req.body.email;

        // TODO: Using email, find user from your database.
        const payload = {
          id: 1, // User ID from database
          enail: emailAddress,
        };

        // TODO: Make this a one-time-use token by using the user's
        // current password hash from the database, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        // var secret = user.password + ‘-' + user.created.getTime();
        const secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';

        const token = JWT.encode(payload, secret);

        // TODO: Send email containing link to reset password.
        // In our case, will just return a link to click.
        res.send(`<a href="/resetpassword/${payload.id}/${token}">Reset password</a>`);
      } else {
        res.send('Email address is missing.');
      }
      return next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: 'Error remove user' });
    }
  },

  secret: async (req, res) => {
    console.log('I managed to get here!');
    res.json({ secret: 'resource' });
  },

  pruebas: async (req, res) => {
    res.status(200).send({ message: 'Probando controlador de usuarios', user: req.user });
  },
};
