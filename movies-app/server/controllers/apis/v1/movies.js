const express = require('express');
const moviesService = require('../../../services/v1/movies/movies');
const movieSearchService = require('../../../services/v1/movies/movieSearch');
const auth = require('../../../middlewares/authentication');
const authadmin = require('../../../middlewares/adminauth');

let router = express.Router();

router.get('/', auth.checkJwt, moviesService.displayAll)
router.get('/:movieId', auth.checkJwt, moviesService.moviesById)
router.get('/:movieId/countries', auth.checkJwt, moviesService.viewcountries)
router.get('/:movieId/writers', auth.checkJwt, moviesService.viewwriters)
router.get('/writers/:writerName', auth.checkJwt, moviesService.writermovie)
router.post('/', auth.checkJwt, movieSearchService.search)
router.post('/favourite/:movieId', auth.checkJwt, moviesService.favourite)
router.get('/random/movie', auth.checkJwt, moviesService.rand)
router.get('/favourites/favorite', auth.checkJwt, moviesService.displayFavourite)
router.post('/comment/:movieId', auth.checkJwt, moviesService.comment)
router.get('/comment/display/:movieId', auth.checkJwt, moviesService.commentdisplay)

module.exports = router