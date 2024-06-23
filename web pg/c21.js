const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('node:path');
const { isLoggedIn } = require('./helpers/util');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express()
const User = require('./models/User');
const Todo = require('./models/Todo');
const moment = require('moment');
const { unlinkSync } = require('node:fs');

app.set('view engine', 'ejs');
app.use(flash());
app.use(fileUpload());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'ayamgoreng',
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    let flash = req.flash('fail')[0] || req.flash('success')[0];
    console.log(req.flash())
    res.render('login', { flash })
})

app.post('/', (req, res) => {
    let message = '';
    const { password, email } = req.body;
    User.cek(email, (row) => {
        if (row.length == 0) {
            message = 'user doesn\'t exist, please sign up!';
            req.flash('fail', message)
            res.redirect('/register')
        } else {
            bcrypt.compare(password, row[0].password, (err, same) => {
                if (err) throw err;
                if (!same) {
                    message = 'wrong password';
                    req.flash('fail', message)
                    res.redirect('/')
                } else {
                    req.session.user = { userid: row[0].userid, email: row[0].email, avatar: row[0].avatar };
                    res.redirect('/todos')
                }
            })
        }
    })
})

app.get('/register', (req, res) => {
    let flash = req.flash('fail')[0] || req.flash('success')[0];
    console.log(req.flash())
    res.render('register', { flash })
})

app.post('/register', (req, res) => {
    let message = '';
    try {
        const { password, retypepass, email } = req.body;
        User.cek(email, (row) => {
            if (password !== retypepass) {
                message = 'password doesn\'t match';
                req.flash('fail', message);
                res.redirect('/register')
            } else if (row.length > 0) {
                message = 'user already exist, please sign in!';
                req.flash('fail', message);
                res.redirect('/');
            } else {
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    if (err) throw err;
                    User.add(email, hash, () => {
                        message = 'successfully registered, please sign in!';
                        req.flash('success', message);
                        res.redirect('/')
                    })
                });
            }
        })

    } catch (err) {
        console.log(err);
    }
})

app.get('/todos', isLoggedIn, (req, res) => {
    // console.log('masuk todos');
    // console.table(req.session.user);
    let query = req.query || {};
    let url = req.url;
    if (Object.keys(query).length == 0) url += '?page=1'
    else if (url.search('page') == -1) url += '&page=1';
    query.limit = 5;
    if (!query.page) query.page = 1;
    if (!query.sortBy) {
        url += '&sortBy=id'
        query.sortBy = 'id';
    }
    if (!query.sortMode) {
        url += '&sortMode=asc'
        query.sortMode = 'asc';
    }
    console.log(query);
    typeof query.complete === 'undefined' ? '' : query.complete = JSON.parse(query.complete);
    let search = JSON.parse(JSON.stringify(query));
    typeof search.complete === 'undefined' ? '' : search.complete = JSON.parse(search.complete);
    let x = Object.keys(search).length;
    while (x--) {
        if (Object.values(search)[x] === '' || Object.keys(search)[x] == 'page' || Object.keys(search)[x] == 'sortBy' || Object.keys(search)[x] == 'sortMode' || Object.keys(search)[x] == 'limit') delete search[Object.keys(search)[x]];
    }
    query.userid = req.session.user.userid;
    search = preferredOrder(search, ['operation', 'title', 'complete', 'date1', 'date2']);
    Todo.readTodo(query, search, (rows, banyak) => {
        rows.forEach(isi => isi.deadline = moment(isi.deadline).format('DD MMMM YYYY HH:mm'));
        res.render('index', { rows, email: req.session.user.email, avatar: req.session.user.avatar, query, url, banyak })
    })
})

app.get('/avatar', isLoggedIn, (req, res) => res.render('avatar', { user: req.session.user }))

app.post('/avatar', isLoggedIn, (req, res) => {
    let sampleFile;
    let uploadPath;
    let previousAvatar;
    let user = req.session.user;
    // console.log('masuk avatar post');

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).redirect('/todos');
    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        sampleFile = req.files.avatar;
        let fileName = JSON.stringify(Date.now()) + sampleFile.name;
        uploadPath = __dirname + '/public/images/' + fileName;
        if (req.session.user.avatar != 'default-avatar.png') {
            previousAvatar = __dirname + '/public/images/' + req.session.user.avatar;
            unlinkSync(previousAvatar);
        }
        req.session.user.avatar = fileName;
        // Use the mv() method to place the file somewhere on your server
        User.editAvatar(user.userid, fileName, () => sampleFile.mv(uploadPath, function (err) {
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

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));

})

app.get('/delete/:id', isLoggedIn, (req, res) => {
    // console.log(req.params);
    Todo.deleteTodo(Number(req.params.id), () => res.redirect('/todos'))
})

app.get('/edit/:id', isLoggedIn, (req, res) => {
    Todo.readTodoById(Number(req.params.id), (rows) => {
        rows.forEach(isi => isi.deadline = moment(isi.deadline).format('YYYY-MM-DD[T]HH:mm'))
        res.render('update', { rows });
    })
})

app.post('/edit/:id', isLoggedIn, (req, res) => {
    // console.log(req.body);
    if (typeof req.body.complete === 'undefined') req.body.complete = false;
    Todo.updateTodo(Number(req.params.id), req.body, () => res.redirect('/todos'))
})

function preferredOrder(obj, order) {
    var newObject = {};
    for (var i = 0; i < order.length; i++) {
        if (obj.hasOwnProperty(order[i])) {
            newObject[order[i]] = obj[order[i]];
        }
    }
    return newObject;
}

app.listen(3000, () => console.log('berjalan di port 3000'));