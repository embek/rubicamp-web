const express = require('express')
const { readFileSync, writeFileSync } = require('fs')
const app = express()

const biodata = JSON.parse(readFileSync('biodata.json', 'utf-8'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log('masuk load /');
    res.render('index', { biodata })
})

app.get('/add', (req, res) => {
    console.log('masuk get /add');
    res.render('form', { biodata: {}, id: -1 })
})

app.post('/add', (req, res) => {
    console.log('masuk post /');
    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('close', () => {
        let params = new URLSearchParams(body);
        let name = params.get('name');
        let height = params.get('height');
        let weight = params.get('weight');
        let married = JSON.parse(params.get('married'));
        let birthdate = params.get('birthdate');
        biodata.push({ name, height, weight, birthdate, married });
        writeFileSync('biodata.json', JSON.stringify(biodata))
        res.redirect('/')
    })
})

app.get('/edit/:id', (req, res) => {
    let id = Number(req.params.id);
    console.log('masuk get /edit', id);
    console.log(biodata[id]);
    res.render('form', { biodata, id });
})

app.post('/edit/:id', (req, res) => {
    console.log('masuk post /edit')
    let id = Number(req.params.id);
    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('close', () => {
        let params = new URLSearchParams(body);
        let name = params.get('name');
        let height = params.get('height');
        let weight = params.get('weight');
        let married = JSON.parse(params.get('married'));
        let birthdate = params.get('birthdate');
        biodata[id] = { name, height, weight, married, birthdate };
        console.log(biodata[id]);
        writeFileSync('biodata.json', JSON.stringify(biodata))
        res.redirect('/')
    })
})

app.get('/delete/:id', (req, res) => {
    try {
        console.log('masuk /delete', req.params.id)
        let id = Number(req.params.id);
        biodata.splice(id, 1);
        writeFileSync('biodata.json', JSON.stringify(biodata))
        res.redirect('/');
    } catch (e) { console.log(e) }
})

app.listen(3000);