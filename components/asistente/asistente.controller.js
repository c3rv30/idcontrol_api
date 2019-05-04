const moment = require('moment');
const Asistente = require('./asistente.model');

module.exports = {

  /* SOLUCION PROVISORIA
    
  */
  asisCounter: async (req, res, next) => {
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
      console.log(countNio);

      let i = 0;
      let acumMesActual = 0;
      const iMax = countAsis.length;
      for (; i < iMax; i += 1) {
        const dateFormat = moment(countAsis[i].fecha, 'DD/MM/YYYY').format('YYYY/MM/DD');
        const after = moment(new Date(dateFormat)).isAfter(startOfMonth); // true
        if (after) {
          acumMesActual += 1;
          // console.log('La puta madre ivan');
        }
        console.log('Date Format: ', moment(countAsis[i].fecha, 'DD/MM/YYYY').month());
      }



      return res.status(200).json({ message: countNio });

      // return next();
    } catch (error) {
      console.log(error);
      return res.status(404).send({ message: 'error' });
    }
  },

};




/* sagdgldfhñjsdhdf´dflmñdfvl´mñdvsf´dvms´lvsl´mdvfd */

/* if (countAsis) {
        console.log('Array Length: ', countAsis.length);
        // console.log('Asistentes: ', countAsis);
        // Acumula asistentes del mes actual
        let i = 0;
        let acumMesActual = 0;
        const iMax = countAsis.length;
        for (; i < iMax; i += 1) {
          const dateFormat = moment(countAsis[i].fecha, 'DD/MM/YYYY').format('YYYY/MM/DD');
          const after = moment(new Date(dateFormat)).isAfter(startOfMonth); // true
          if (after) {
            acumMesActual += 1;
            // console.log('La puta madre ivan');
          }
          console.log('Date Format: ', moment(countAsis[i].fecha, 'DD/MM/YYYY').month());
        }
        console.log('Asistentes del mes actual: ', acumMesActual);
        return res.status(200).json({ message: 'ok' });
      }
      */
// 'Colchagua CD'

/* const countAsis = await Asistente.find(
      {
        $match:
        {
          fecha: { $gte: startOfMonth },
          equipo,
        },
      },
      {
        $group: {
          _id: '$equipo',
          equipoCount: { $sum: 1 },
        },
      },
    ); */

// console.log(startOfMonth);
// console.log(typeof now);
// find({ airedAt: { $gte: '1987-10-19', $lte: '1987-10-26' } }).
