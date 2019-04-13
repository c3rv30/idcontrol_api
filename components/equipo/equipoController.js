const Equipo = require('./equipo');

module.exports = {
  create: async (req, res) => {
    try {
      // console.log(req.value.body);
      const {
        name,
        email,
        dir,
        ciudad,
        comuna,
        image,
      } = req.value.body;

      // Check if there is a equipo with the same email
      const foundEquipo = await Equipo.findOne({ email });
      if (foundEquipo) {
        return res.status(403).json({ error: 'Email is already in use' });
      }
      // Create new equipo
      const newEquipo = new Equipo({
        name,
        email,
        address: {
          dir,
          ciudad,
          comuna,
        },
        image,
      });

      await newEquipo.save();
      return res.status(200).json({ message: 'Equipo Resgistrado' });
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  updateEquipo: async (req, res, next) => {
    try {
      const equipoID = req.params.id;
      const {
        name,
        email,
        dir,
        ciudad,
        comuna,
        image,
      } = req.value.body;

      const updateEquipo = {
        name,
        email,
        address: {
          dir,
          ciudad,
          comuna,
        },
        image,
      };

      console.log(updateEquipo);
      // Check if there is a user with the same email
      await Equipo.findByIdAndUpdate(equipoID, updateEquipo, { new: true });

      if (updateEquipo) {
        return res.status(200).json({ succesful: 'Equipo editado' });
      }
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Error edit equipo' });
    }
    return next();
  },

  /* Delete Equipo */
  deleteEquipo: async (req, res, next) => {
    try {
      const { equipoID } = req.params.id;

      const equipoRemoved = await Equipo.deleteOne(equipoID);

      if (equipoRemoved) {
        return res.status(200).json({ message: 'Equipo Eliminado' });
      }
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: 'Error remove equipo' });
    }
    return next();
  },

  pruebas: async (req, res) => {
    try {
      return res.status(200).json({ message: 'Todo ok hdp' });
    } catch (error) {
      return res.status(404).send({ message: 'Las pelotas' });
    }
  },
};
