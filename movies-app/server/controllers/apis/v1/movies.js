const express = require('express');
const moviesService = require('../../../services/v1/movies/movies');
const movieSearchService = require('../../../services/v1/movies/movieSearch');

let router = express.Router();

router.get('/', moviesService.displayAll)
router.get('/:movieId', moviesService.moviesById)
router.get('/:movieId/countries', moviesService.viewcountries)
router.get('/:movieId/writers', moviesService.viewwriters)
router.get('/writers/:writerName', moviesService.writermovie)
router.post('/', movieSearchService.search)


module.exports = router