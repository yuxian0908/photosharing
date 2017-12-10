var express = require('express');
var router = express.Router();
var index = require('../controllers/index.server.controller');
var chat = require('../controllers/chat.server.controller');
var passport = require('passport');

/* GET home page. */
router.route('/')
      .get(index.requiresLogin,index.renderchat);

router.route('/:id')
      .get(index.requiresLogin,index.renderchat);

router.route('/getChatPatner')
      .post(index.requiresLogin,index.getChatPatner);

router.route('/join')
      .post(chat.join);

router.route('/leave')
      .post(chat.leave);

router.route('/send_message')
      .post(chat.send_message);
   
router.route('/get_messages')
      .post(chat.get_messages);

router.route('/get_chatters')
      .post(chat.get_chatters);


module.exports = router;
