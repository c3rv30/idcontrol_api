const express = require('express');

const router = express.Router();

router.use('/', require('./userRoute'));

module.exports = router;
