const express = require('express');
const moviesUDService = require('../../../services/v1/admin/movies');
const auth = require('../../../middlewares/authentication');

let router = express.Router();

router.get('/:page', auth.checkJwt, moviesUDService.listMovies)
router.get('/update/:moviesId', auth.checkJwt, moviesUDService.displayupdate)
router.get('/update/array/:moviesId', auth.checkJwt, moviesUDService.displayarrayupdate)
router.post('/update/:moviesId', auth.checkJwt, moviesUDService.update)
router.post('/update/array/:moviesId', auth.checkJwt, moviesUDService.updatearray)
router.get('/delete/:moviesId', auth.checkJwt, moviesUDService.del)
module.exports = router