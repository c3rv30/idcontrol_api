const router = require('express-promise-router')();
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const equipoController = require('./equipoController');
const middlewareAuth = require('../../middleware/auth');

const upload = require('../../helpers/avatar.config');

// Equipo Routes
router.route('/createquipo')
  .post(validateBody(schemas.equipoSchema),
    middlewareAuth.ensureAuth, equipoController.create);

router.route('/update-equipo/:id')
  .put(validateBody(schemas.equipoSchema),
    middlewareAuth.ensureAuth, equipoController.updateEquipo);

router.route('/delete-equipo/:id')
  .delete(middlewareAuth.ensureAuth, equipoController.deleteEquipo);


router.route('/upload-image')
  .post(validateBody(schemas.equipoSchema), (req, res) => {
    upload.avatarUpload(req, res, (err, next) => {
      try {
        if (err) {
          console.log(err);
          return res.status(403).send('Errorrrrrrrrrr');
        }
        if (req.file === undefined) {
          console.log('Error: no file selected');
        } else {
          console.log(file);
        }
      } catch (error) {
        return res.status(403).send('Errorrrrrrrrrr');
      }
      return next();
    });
  });

/* link prueba middleware */
router.route('/probando-middleware-equipo')
  .get(middlewareAuth.ensureAuth, equipoController.pruebas);

module.exports = router;
