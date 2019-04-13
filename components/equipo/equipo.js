const mongoose = require('mongoose');
const User = require('../user/user');

const { Schema } = mongoose;

// we create a equipo schema
const equipoSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    dir: { type: String },
    ciudad: { type: String },
    comuna: { type: String },
  },
  image: {
    type: String,
  },
}, { runSettersOnQuery: true });

equipoSchema.pre('save', async (next) => {
  try {
    // this.email = this.email.toLowerCase(); // ensure email are in lowercase
    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

equipoSchema.pre('deleteOne', async (next) => {
  try {
    const equipo = this;
    User.model('user').deleteOne({ equipo: equipo._id }, next);
    return next();
  } catch (error) {
    return console.log(error);
  }
});

const Equipo = mongoose.model('equipo', equipoSchema);

module.exports = Equipo;
