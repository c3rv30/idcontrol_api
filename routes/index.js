const express = require('express');

const router = express.Router();
const passportAuth = require('../middleware');

/* USER LOGIN */
router.use('/v1', passportAuth.localAuth, require('../components/user'));

module.exports = router;
