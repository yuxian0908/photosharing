var mongoose = require('mongoose');

exports.renderindex = function(req,res){
    res.render('index', { title: 'Express' });
};