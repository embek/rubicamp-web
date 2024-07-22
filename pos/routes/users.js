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

router.post('/add', async (req, res) => {
  try {
    console.log(req.body);
    let { password } = req.body;
    console.log(password);
    let hash = bcrypt.hashSync(password, saltRounds);
    await User.add({ ...req.body, password: hash });
    res.status(201).redirect('/users');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.get('/edit/:id', async (req, res) => {
  try {
    const data = await User.cek('userid',req.params.id);
    res.render('users/edituser', { name: req.session.userid.name, data })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.post('/edit/:id', async (req, res) => {
  try {
    await User.edit({ userid: req.params.id, ...req.body });
    res.status(201).redirect('/users');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.get('/data', async (req, res) => {
  // console.log(req.query);
  try {
    const response = await User.list(req.query);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.delete('/delete/:id', (req, res) => {
  try {
    console.log('aaa')
    res.status(200).redirect('/users')
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;
