const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../../configuration');
const User = require('./user');


const signToken = async (user) => {
  try {
    return await JWT.sign({
      iss: 'shtspa22',
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    }, JWT_SECRET);
  } catch (error) {
    return console.log(error);
  }
};

module.exports = {
  signUp: async (req, res) => {
    try {
      const { email, password } = req.value.body;

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
      });

      await newUser.save();

      // Generate the token
      const token = signToken(newUser);
      // Respond with token
      return res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Error signUp' });
    }
  },

  signIn: async (req, res) => {
    try {
      // Generate token
      const token = signToken(req.user);
      return res.status(200).send({ token });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Error signIn' });
    }
  },

  secret: async (req, res) => {
    console.log('I managed to get here!');
    res.json({ secret: 'resource' });
  },
};
