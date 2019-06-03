const express = require('express');

const router = express.Router();

router.use('/', require('./sentry.route'));

module.exports = router;
