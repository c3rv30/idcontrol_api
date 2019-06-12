const mongoose = require('mongoose');

const { Schema } = mongoose;

const blackSchema = new Schema({
  rut: {
    type: String,
  },
  tipo_lista: {
    type: String,
  },
});

const Black = mongoose.model('black', blackSchema);

module.exports = Black;
