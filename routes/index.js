const express = require('express');

const router = express.Router();

/*  */
router.use('/v1', require('../components/user'));

module.exports = router;
