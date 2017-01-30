module.exports = function(lobby){

	var express = require('express');
	var router = express.Router();

    router.get('/', function (req, res, next){
        res.render('game');
    });

    return router;
}