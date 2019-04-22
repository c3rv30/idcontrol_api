const express = require('express');

const router = express.Router();

router.use('/', require('./asistente.route'));

module.exports = router;
