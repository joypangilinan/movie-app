const express = require('express');
const publicService = require('../../../services/v1/public/publicPage');

let router = express.Router();

router.get('/', publicService.public)
module.exports = router