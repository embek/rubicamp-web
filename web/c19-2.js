const express = require('express');
const { createBio, readBio, addBio, editBio, updateBio, deleteBio } = require('./controllers/biodataControllers');
const bodyParser = require('body-parser');
const path = require('node:path');
const app = express()

app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', readBio)

app.get('/add', addBio)

app.post('/add', createBio)

app.get('/edit/:id', editBio);

app.post('/edit/:id', updateBio)

app.get('/delete/:id', deleteBio)

app.listen(3000, () => console.log('berjalan di port 3000'));