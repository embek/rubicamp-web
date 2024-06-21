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
    secret: 'ayamgoreng',
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req, res) => res.render('login'))

app.post('/', (req, res) => {
    let message = '';
    const { password, email } = req.body;
    User.cek(email, (row) => {
        if (row.length == 0) {
            message = '';
            res.render('register', { message })
        } else {
            bcrypt.compare(password, row[0].password, (err, same) => {
                console.log(err, same)
                if (err) throw err;
                if (!same) {
                    message = 'password salah';
                    res.render('login', { message })
                } else {
                    req.session.user = { userid: row[0].userid, email: row[0].email };
                    console.log(req.session)
                    res.redirect('/todos')
                }
            })
        }
    })
})

app.get('/register', (req, res) => res.render('register'))

app.post('/register', (req, res) => {
    let message = '';
    try {
        const { password, retypepass, email } = req.body;
        User.cek(email, (row) => {
            if (row.length > 1) {
                message = 'user already exist';
                res.render('login', { message })
            } else if (password !== retypepass) {
                message = 'password tidak sama';
                res.render('register', { message })
            } else {
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    if (err) throw err;
                    User.add(email, hash, () => res.redirect('/'))
                });
            }
        })

    } catch (err) {
        console.log(err);
    }
})

app.get('/todos', isLoggedIn, (req, res) => {
    console.log('masuk todos')
    let query = req.query || {};
    let url = req.url;
    query.limit = 5;
    if (!query.page) query.page = 1;
    if (!query.sortBy) query.sortBy = 'userid';
    if (!query.sortMode) query.sortMode = 'ASC';
    let search = query;
    let x = Object.keys(search).length;
    while (x--) {
        if (Object.values(search)[x] == '' || Object.keys(search)[x] == 'page' || Object.keys(search)[x] == 'sortBy' || Object.keys(search)[x] == 'sortMode') delete search[Object.keys[x]];
    }
    search.userid = req.session.user.userid;
    Todo.readTodo(query, search, (rows, banyak) => res.render('index', { rows, email: req.session.user.email, query, url, banyak }))
})

app.get('/avatar', isLoggedIn, (req, res) => res.render('avatar', { user: req.session.user }))

app.post('/avatar', isLoggedIn, (req, res) => {
    let sampleFile;
    let uploadPath;
    let user = req.session.user;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        sampleFile = req.files.avatar;
        uploadPath = __dirname + '/public/images/' + JSON.stringify(Date.now()) + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        User.editAvatar(user.userid, sampleFile.name, () => sampleFile.mv(uploadPath, function (err) {
            if (err) return res.status(500).send(err);
            res.redirect('/todos');
        }))
    }
});

app.get('/todos/add', isLoggedIn, (req, res) => res.render('form'))

app.post('/todos/add', isLoggedIn, (req, res) => {
    let user = req.session.user;
    Todo.addTodo(user.userid, req.body.title, () => res.redirect('/todos'))
})

app.get('logout', (res, req) => {
    req.session.destroy();
    res.redirect('/')
})

app.listen(3000, () => console.log('berjalan di port 3000'));