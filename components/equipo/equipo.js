const mongoose = require('mongoose');

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

equipoSchema.pre('save', async function pre(next) {
  try {
    this.email = this.email.toLowerCase(); // ensure email ar e in lowercase
    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

const Equipo = mongoose.model('equipo', equipoSchema);

module.exports = Equipo;
