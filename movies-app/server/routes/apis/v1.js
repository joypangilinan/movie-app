const moviesController = require('../../controllers/apis/v1/movies');

const express = require('express');
let router = express.Router();

router.use('/', moviesController);
module.exports = router;