var express = require('express');
var router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('login', { fail: req.flash('fail') });
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await User.cek(email);
        console.log(data);
        console.log(req.session.userid)
        const verified = bcrypt.compareSync(password, data[0].password);
        if (verified) {
            req.session.userid = data[0];
            res.redirect('/dashboard')
        } else throw Error('wrong username or password')
    } catch (error) {
        console.log(error);
        req.flash('fail', 'wrong username or password');
        res.redirect('/');
    }
})

module.exports = router;
