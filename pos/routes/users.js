var express = require('express');
var router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users/listusers', { name: req.session.userid.name });
});

router.get('/add', (req, res) => {
  res.render('users/addusers', { name: req.session.userid.name })
})

module.exports = router;
