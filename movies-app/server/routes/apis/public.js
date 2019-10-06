const publicController = require('../../controllers/apis/v1/public');

const express = require('express');
let router = express.Router();

router.use('/', publicController);

module.exports = router;