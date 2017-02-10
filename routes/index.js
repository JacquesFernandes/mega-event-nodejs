var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next){
    if (req.sess.username === null || req.sess.username === undefined)
    {
        res.redirect("http://www.teknack.in");
        return;
    }
    res.render('index');
});

module.exports = router;
