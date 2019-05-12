const moment = require('moment');
const Asistente = require('./asistente.model');

module.exports = {

  /* ********** SOLUCION PROVISORIA **********
    Contabiliza todos los asistentes de cada mes del presente y actual año
    para su posterior comparacion en un grafico de barras en angular.

    Solucion provisoria adaptada al actual modelo de datos,
    se debe generar el nuevo modelo y adapatarlo a esa nueva estructura.
  */

  asisCounter: async (req, res) => {
    const { equipo } = req.body;
    // const startOfMonth = moment().startOf('month').format('YYYY/MM/DD');
    // const endOfMonth = moment().endOf('month').format('YYYY/MM/DD');
    const lastYear = moment().subtract(1, 'years').format('YYYY');
    try {
      const countNio = await Asistente.aggregate(
        [
          { $match: { equipo, fecha: { $gte: new Date(lastYear) } } },
          {
            $group: {
              _id: { equipo: '$equipo', month: { $month: '$fecha' }, year: { $year: '$fecha' } },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
        ],
      );

      const lastYearArray = [];
      const currentYearArray = [];
      let i = 0;
      const iMax = countNio.length;

      for (; i < iMax; i += 1) {
        const mon = moment().month(countNio[i]._id.month - 1).format('MMMM');

        if (countNio[i]._id.year === parseInt(lastYear, 10)) {
          lastYearArray.push({ month: mon, count: countNio[i].count });
        } else {
          currentYearArray.push({ month: mon, count: countNio[i].count });
        }
      }
      return res.status(200).send({ lastYearArray, currentYearArray });
    } catch (error) {
      console.log(error);
      return res.status(404).send({ message: 'error' });
    }
  },
};
