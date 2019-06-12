const express = require('express');

const router = express.Router();

router.use('/', require('./black.route'));

module.exports = router;
