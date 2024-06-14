const express = require('express');
const bodyParser = require('body-parser');
const path = require('node:path');
const { isLoggedIn } = require('./helpers/util');
const fileUpload = require('express-fileupload');
const app = express()

app.set('view engine', 'ejs');
app.use(fileUpload());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.post('/avatar', (req, res) => {
    let sampleFile;
    let uploadPath;
    let userid = req.session.userid;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        sampleFile = req.files.avatar;
        uploadPath = __dirname + '/public/images/' + JSON.stringify(Date.now()) + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        User.editAvatar(userid, sampleFile.name, () => sampleFile.mv(uploadPath, function (err) {
            if (err) return res.status(500).send(err);
            res.redirect('/todos');
        }))
    }
});

app.get('/', /*isLoggedIn,*/(req, res) => res.render('login'))

app.get('/register', (req, res) => res.render('register'))

app.post('/register', (req, res) => { })

app.get('/todos', (req, res) => res.render('index'))

app.get('/avatar', (req, res) => res.render('avatar'))

app.get('/todos/add', (req, res) => res.render('form'))

app.listen(3000, () => console.log('berjalan di port 3000'));