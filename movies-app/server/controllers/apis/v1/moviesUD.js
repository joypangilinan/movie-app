const express = require('express');
const moviesUDService = require('../../../services/v1/admin/movies');


let router = express.Router();

router.get('/:page', moviesUDService.listMovies)
router.get('/update/:moviesId', moviesUDService.displayupdate)
router.get('/update/array/:moviesId', moviesUDService.displayarrayupdate)
router.post('/update/:moviesId', moviesUDService.update)
router.post('/update/array/:moviesId', moviesUDService.updatearray)
router.delete('/delete/:moviesId', moviesUDService.del)
module.exports = router