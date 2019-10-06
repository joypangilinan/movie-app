const express = require('express');
const v1ApiController = require('./v1');
let router = express.Router();
router.use('/', v1ApiController);
router.use('/admin',v1ApiController)
module.exports = router;