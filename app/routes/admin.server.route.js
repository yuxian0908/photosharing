var express = require('express');
var router = express.Router();
var admin = require('../controllers/admin.server.controller');
var passport = require('passport');

/* GET users listing. */
router.route('/')
      .get(admin.renderadmin); 

router.route('/signup')
      .post(admin.signup);

// Set up the 'signin' routes 
router.route('/signin')
      .post(passport.authenticate('local', {
            successRedirect: '/_admin',
            failureRedirect: '/_admin/signin',
            failureFlash: true
      }));
/** API path that will upload the photos */
router.route('/upload')
      .post(admin.uploadphotos);

// Set up the 'signout' route
router.post('/signout', admin.signout);
      
module.exports = router;
