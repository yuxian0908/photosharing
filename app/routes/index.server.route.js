var express = require('express');
var router = express.Router();
var index = require('../controllers/index.server.controller');
var cart = require('../controllers/cart.server.controller');
var passport = require('passport');
var cloudStorage = require('../controllers/cloudStorage.server.controller');

/* GET home page. */
router.route('/')
      .get(index.renderindex);

// cloudStorage init
router.route('/cloud')
      .get(cloudStorage.boxinit);

router.route('/cloud/redirect')
      .get(cloudStorage.getToken);
// /cloudStorage init

router.route('/test')
      .get(cloudStorage.test);

router.route('/getuser')
      .post(index.getuser); 

router.route('/searchuser')
      .post(index.requiresLogin,index.searchuser); 

router.route('/getOtheruser')
      .post(index.getOtheruser); 


// 登入系統
router.route('/signup')
      .post(index.signup);

router.route('/signin')
      .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/signin',
            failureFlash: true
      }))
      .get(function(){
            console.log('signin error');
      });

router.post('/signout', index.signout);



/** API path that will upload the photos */
router.route('/photos/:id')
      .post(cloudStorage.deletephoto); 

router.route('/upload')
      .post(cloudStorage.uploadphotos);

router.route('/showphotos')
      .post(cloudStorage.showphotos);


// 購物車功能
router.route('/addToCart')
      .post(cart.addToCart,cart.returnCart)
      .get(cart.returnCart);

router.route('/deleteFromCart')
      .post(cart.deleteFromCart,cart.returnCart);

router.route('/submitCart')
      .post(cart.submitCart,cart.returnCart);

// 相簿功能
router.route('/getAlbum')
      .get(index.getAlbum);

router.route('/deleteAlbum')
      .post(index.deleteAlbum);

module.exports = router;
