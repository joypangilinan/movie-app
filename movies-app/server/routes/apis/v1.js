const moviesController = require('../../controllers/apis/v1/movies');
const moviesAdminController = require('../../controllers/apis/v1/moviesUD');

const express = require('express');
let router = express.Router();

router.use('/', moviesController);
router.use('/list', moviesAdminController)

module.exports = router;