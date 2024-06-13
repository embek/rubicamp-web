const express = require('express');
const bodyParser = require('body-parser');
const path = require('node:path');
const app = express()

app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.render('login'))

app.get('/register', (req, res) => res.render('register'))

app.post('/register',(req,res)=>{})

app.get('/todos', (req, res) => res.render('index'))

app.get('/avatar', (req, res) => res.render('avatar'))

app.post('/avatar', (req, res) => res.render('avatar'))

app.get('/todos/add', (req, res) => res.render('form'))

app.listen(3000, () => console.log('berjalan di port 3000'));