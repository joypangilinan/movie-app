const express = require('express');
const moviesUDService = require('../../../services/v1/admin/movies');


let router = express.Router();

router.get('/:page', moviesUDService.listMovies)
router.post('/update/:moviesId', moviesUDService.update)
router.delete('/delete/:moviesId', moviesUDService.del)
module.exports = router