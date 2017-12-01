var express = require('express');
var router = express.Router();
var admin = require('../controllers/admin.server.controller');
var index = require('../controllers/index.server.controller');
var passport = require('passport');

/* GET users listing. */
router.route('/')
      .get(index.requiresLogin,admin.adminUser,admin.renderadmin); 

router.route('/giveAdmin')
      .post(admin.giveAdmin);

router.route('/eraseAdmin')
      .post(admin.eraseAdmin);

router.route('/getusers')
      .post(admin.getusers);

module.exports = router;
