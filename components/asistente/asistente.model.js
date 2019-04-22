const mongoose = require('mongoose');

const { Schema } = mongoose;

const asistenteSchema = new Schema({
  rut: {
    type: String,
  },
  fechaRegistro: {
    type: String,
  },
  equipo: {
    type: Schema.Types.ObjectId, ref: 'equipo',
  },
  idDispositivo: {
    type: String,
  },
}, { runSetterOnQuery: true });

const Asistente = mongoose.model('asistente', asistenteSchema);

module.exports = Asistente;
