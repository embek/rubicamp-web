const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const path = require('node:path');
const { isLoggedIn } = require('./helpers/util');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express()
const User = require('./models/User');
const Todo = require('./models/Todo');

app.set('view engine', 'ejs');
app.use(fileUpload());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'ayam goreng',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.get('/', (req, res) => res.render('login'))

app.post('/', (req, res) => {
    let message = '';
    const { password, email } = req.body;
    User.cek(email, (row) => {
        if (row.length == 0) {
            message = '';
            res.render('login', { message })
        } else {
            if (row[0].password != password) {
                message = '';
                res.render('login', { message })
            } else {
                req.session.userid = row[0].userid;
                res.redirect('/todos')
            }
        }
    })
})

app.get('/register', (req, res) => res.render('register'))

app.post('/register', (req, res) => {
    try {
        const { password, retypepass, email } = req.body;
        if (password !== retypepass) {
            let message = '';
            res.render('/register', { message })
        } else {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) throw err;
                User.add(email, hash, () => res.redirect('/'))
            });
        }
    } catch (err) {
        console.log(err);
    }
})

app.get('/todos', (req, res) => {
    let query = res.query;
    query.limit = 5;
    Todo.readTodo(query, (rows) => res.render('index', { rows }))
})

app.get('/avatar', (req, res) => res.render('avatar', { userid: req.session.userid }))

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

app.get('/todos/add', (req, res) => res.render('form'))

app.post('/todos/add', (req, res) => {
    let userid = req.session.userid;
    Todo.addTodo(userid, req.body.title, () => res.redirect('/todos'))
})

app.listen(3000, () => console.log('berjalan di port 3000'));