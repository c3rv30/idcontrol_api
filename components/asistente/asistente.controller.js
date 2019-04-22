const Asistente = require('./asistente.model');

module.exports = {

  pruebas: async (req, res, next) => {
    try {
      const countAsis = await Asistente.aggregate([
        {
          $match:
          {
            equipo: 'Colchagua CD',
          },
        },
        {
          $group: {
            _id: '$equipo',
            equipoCount: { $sum: 1 },
          },
        },
      ]);
      if (countAsis) {
        const [{ equipoCount }] = countAsis;
        console.log(typeof equipoCount);
        return res.status(200).json({ equipoCount });
      }
      return next();
    } catch (error) {
      console.log(error);
      return res.status(404).send({ message: 'error' });
    }
  },
};
