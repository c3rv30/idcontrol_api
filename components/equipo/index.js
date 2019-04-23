const express = require('express');

const router = express.Router();

router.use('/', require('./equipo.route'));

module.exports = router;
