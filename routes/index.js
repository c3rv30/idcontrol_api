const express = require('express');

const router = express.Router();

/*  */
router.use('/v1', require('../components/user'));
router.use('/v1', require('../components/equipo'));
router.use('/v1', require('../components/asistente'));
router.use('/v1', require('../components/sentry'));

module.exports = router;
