const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../../configuration');
const User = require('./user');
const hash = require('../bcrypt');

function signToken(user) {
  return JWT.sign({
    iss: 'shtspa22',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
  }, JWT_SECRET);
}


module.exports = {
  signUp: async (req, res, next) => {
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
    //next();
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

  updateUser: async (req, res) => {
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

      if (userID != req.user.sub) {
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
  deleteUser: async (req, res) => {
    res.json({ message: 'Delete user link' });
  },

  secret: async (req, res) => {
    console.log('I managed to get here!');
    res.json({ secret: 'resource' });
  },

  pruebas: async (req, res) => {
    res.status(200).send({ message: 'Probando controlador de usuarios', user: req.user });
  },
};
