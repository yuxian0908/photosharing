var express = require('express');
var router = express.Router();
var admin = require('../controllers/admin.server.controller');
var passport = require('passport');

/* GET users listing. */
router.route('/')
      .get(admin.renderadmin); 

router.route('/getuser')
      .post(admin.getuser); 

router.route('/getOtheruser')
      .post(admin.getOtheruser); 

// router.route('/:id')
//       .get(function(req, res) {
//             res.send('hello ' + req.params.id + '!');
//           }); 

router.route('/signup')
      .post(admin.signup);

// Set up the 'signin' routes 
router.route('/signin')
      .post(passport.authenticate('local', {
            successRedirect: '/_admin',
            failureRedirect: '/_admin/signin',
            failureFlash: true
      }))
      .get(function(){
            console.log('signin error');
      });
/** API path that will upload the photos */
router.route('/upload')
      .post(admin.uploadphotos);

router.route('/showphotos')
      .post(admin.showphotos);

// Set up the 'signout' route
router.post('/signout', admin.signout);
      
module.exports = router;
