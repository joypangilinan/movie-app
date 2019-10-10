const express = require('express');
const moviesService = require('../../../services/v1/movies/movies');
const movieSearchService = require('../../../services/v1/movies/movieSearch');
const auth = require('../../../middlewares/authentication');
const authadmin = require('../../../middlewares/adminauth');

let router = express.Router();

router.get('/', auth.checkJwt, moviesService.displayAll)
router.get('/:movieId', moviesService.moviesById)
router.get('/:movieId/countries', moviesService.viewcountries)
router.get('/:movieId/writers', moviesService.viewwriters)
router.get('/writers/:writerName', moviesService.writermovie)
router.post('/', authadmin.checkJwtadmin, movieSearchService.search)
router.post('/favourite/:movieId', auth.checkJwt, moviesService.favourite)
router.get('/random/movie', moviesService.rand)
router.get('/favourites/favorite', auth.checkJwt, moviesService.displayFavourite)


module.exports = router