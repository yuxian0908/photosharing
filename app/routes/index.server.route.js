var express = require('express');
var router = express.Router();
var index = require('../controllers/index.server.controller');
var passport = require('passport');

/* GET home page. */
router.route('/')
      .get(index.renderindex);


router.route('/getuser')
      .post(index.getuser); 

router.route('/searchuser')
      .post(index.requiresLogin,index.searchuser); 

router.route('/getOtheruser')
      .post(index.getOtheruser); 

router.route('/photos/:id')
      .post(index.deletephoto); 

router.route('/signup')
      .post(index.signup);

// Set up the 'signin' routes 
router.route('/signin')
      .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/signin',
            failureFlash: true
      }))
      .get(function(){
            console.log('signin error');
      });
/** API path that will upload the photos */
router.route('/upload')
      .post(index.uploadphotos);

router.route('/showphotos')
      .post(index.showphotos);

// Set up the 'signout' route
router.post('/signout', index.signout);

module.exports = router;
