const express = require('express');

const router = express.Router();
const passportAuth = require('../middleware');

/* USER LOGIN */
router.use('/login', passportAuth.localAuth, require('../components/users'));

module.exports = router;
