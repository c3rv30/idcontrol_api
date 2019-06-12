const mongoose = require('mongoose');
const Black = require('./black.model');

const User = require('../user/user.model');


module.exports = {

  getBlack: async (req, res) => {
    try {
      const { rut } = req.body;
      console.log(rut);
      const email = 'jperez@gmail.com';
      // const founduser = await User.findOne({ 'local.email': email });
      // console.log(founduser);
      const foundRut = await Black.findOne({ 'rut': '17107682k' });
      if (!foundRut) {
        console.log('Lo encontro!!');
      }

      mongoose.connection.db.listCollections({ name: 'blacklist' })
        .next((err, collinfo) => {
          if (collinfo) {
            console.log('Existe');
          } else {
            console.log('error: ', err);
          }
        });
      return res.status(200).json({ message: 'Ñioooo' });
    } catch (error) {
      console.log('error: ', error);
      return res.status(404).json({ message: 'Error de consulta' });
    }
  },
};
