const moment = require('moment');
const Asistente = require('./asistente.model');

module.exports = {

  /* ********** SOLUCION PROVISORIA **********
    Contabiliza todos los asistentes de cada mes del presente y actual año
    para su posterior comparación en un gráfico de barras en angular.

    Solución provisoria adaptada al actual modelo de datos,
    se debe generar el nuevo modelo y adapatarlo a esa nueva estructura.
  */

  /** Total de asistentes para cada mes del año presente y anterior. (2018 - 2019) */
  asisCounter: async (req, res) => {
    try {
      const { equipo } = req.body;
      // const startOfMonth = moment().startOf('month').format('YYYY/MM/DD');
      // const endOfMonth = moment().endOf('month').format('YYYY/MM/DD');
      const lastYear = moment().subtract(1, 'years').format('YYYY');
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

  /** Listado de asistencias a partidos de un asistente especifico (rut) y
      asistencia a un solo partido seleccionando fecha como opción. */
  getAsisByRutDate: async (req, res) => {
    try {
      // FALTA FECHA OPCIONAL
      const { rut, equipo } = req.body;
      const fec = '';
      const start = moment(fec, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const end = moment(fec, 'DD/MM/YYYY').add(1, 'd').format('YYYY-MM-DD');

      // console.log('start: ', start);
      // console.log('end: ', end);
      const asistFound = await Asistente.aggregate(
        [
          { $match: { equipo, rut } },
        ],
      );

      /* const asistencias = [];
      let i = 0;
      const iMax = asistFound.length;

      for (; i < iMax; i += 1) {
        const fec = moment(asistFound[i].fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');
          asistencias.push({ month: mon, count: countNio[i].count });
      } */

      console.log(asistFound);

      if (asistFound.length > 0) {
        return res.status(200).json(asistFound);
        // return res.status(200).json({ succesful: `Asistente Rut: ${rut}` });
      }
      return res.status(200).json({ succesful: 'Asistente no encontrado' });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Error al buscar asistente' });
    }
  },

  /** Total de asistentes mes actual
   * FALTA CONDICION DE MES
   */
  getTotAsisMonth: async (req, res) => {
    try {
      const { equipo } = req.body;
      const actualMonth = moment().get('month');
      const fecha = moment().format('YYYY/MM/DD');

      console.log(fecha);
      console.log(actualMonth);

      const countMonth = await Asistente.aggregate(
        [
          { $match: { equipo, fecha: { $gte: new Date(fecha) } } },
          {
            $group: {
              _id: { equipo: '$equipo', month: { $month: '$fecha' }, year: { $year: '$fecha' } },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
        ],
      );

      return res.status(200).json(countMonth[0].count);
    } catch (error) {
      return res.status(403).json({ error: 'Error' });
    }
  },

  /** Total de asistentes año actual */
  getTotAsisCurrentYear: async (req, res) => {
    try {
      const { equipo } = req.body;
      const currentYear = moment().format('YYYY');
      let totAsist = 0;
      const countYear = await Asistente.aggregate(
        [
          { $match: { equipo, fecha: { $gte: new Date(currentYear) } } },
          {
            $group: {
              _id: { equipo: '$equipo' },
              count: { $sum: 1 },
            },
          },
        ],
      );
      if (countYear.length > 0) {
        totAsist = countYear[0].count;
      }
      return res.status(200).json(totAsist);
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Error' });
    }
  },


  /** Total de asistentes a la fecha */
  getTotAsis: async (req, res) => {
    try {
      const { equipo } = req.body;
      let totAsist = 0;
      const countAllAsis = await Asistente.aggregate(
        [
          { $match: { equipo } },
          {
            $group: {
              _id: { equipo: '$equipo' },
              count: { $sum: 1 },
            },
          },
        ],
      );
      if (countAllAsis.length > 0) {
        totAsist = countAllAsis[0].count;
      }
      return res.status(200).json(totAsist);
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Error' });
    }
  },

  /*
  findBlackList: async (req, res) => {
    try {
      const { rut } = req.body;
      // Check if there is a user with the same email
      const foundRutBlack = await blackLista.findOne({ rut });
      if (foundRutBlack) {
        return res.status(200).json({ error: 'Rut encontrado en lista negra' });
      }
      return res.status(200).json({ error: 'Rut no encontrado en lista negra' });
    } catch (error) {
      return res.status(403).json({ error: 'Error al buscar asistente' });
    }
  },
  */
};
