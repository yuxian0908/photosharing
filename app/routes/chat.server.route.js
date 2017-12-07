var express = require('express');
var router = express.Router();
var index = require('../controllers/index.server.controller');
var cart = require('../controllers/cart.server.controller');
var passport = require('passport');

/* GET home page. */
router.route('/')
      .get(index.requiresLogin,index.renderchat);

module.exports = router;
