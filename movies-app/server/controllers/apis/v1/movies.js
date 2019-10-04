const express = require('express');
const moviesService = require('../../../services/v1/movies/movies');

let router = express.Router();

router.get('/movies', moviesService.display)
router.get('/:movieId', moviesService.moviesById)
router.get('/:movieId/countries', moviesService.viewcountries)
router.get('/:movieId/writers', moviesService.viewwriters)
router.post('/:search', moviesService.search)

module.exports = router