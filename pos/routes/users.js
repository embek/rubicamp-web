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
    let { password } = req.body;
    let hash = bcrypt.hashSync(password, saltRounds);
    await User.edit({ ...req.body, password: hash });
    res.redirect('/users');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.get('/edit/:id', async (req, res) => {
  try {
    const data = await User.cek(req.params.id, 'userid');
    res.render('users/edituser', { name: req.session.userid.name, data })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.put('/edit/:id', async (req, res) => {
  try {
    let { email, password } = req.body;
    let hash = bcrypt.hashSync(password, saltRounds);
    await User.edit(req.params.id, email, hash);
    res.redirect('/users');
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

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;
