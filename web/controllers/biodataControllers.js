const { query } = require('express');
const Biodata = require('../models/Biodata');
let limit = 5;

function readBio(req, res) {
    console.log('masuk readBio')
    let url = req.url;
    if (url == '/') url = '/?page=1'
    if (url.search('page') == -1) url += '&page=1';
    let page = 1;
    if (req.query.page) page = Number(req.query.page)
    let search = JSON.parse(JSON.stringify(req.query));
    let x = Object.keys(search).length - 1;
    if (search.married != undefined) search.married = JSON.parse(search.married)
    while (x >= 0) {
        if (Object.values(search)[x] === '' || Object.keys(search)[x] == 'page') delete search[Object.keys(search)[x]]
        x--;
    }
    Biodata.read(search, limit, page, (biodata, banyak) => {
        // console.log(biodata);
        res.render('index', { biodata, search, page, limit, banyak, url })
    });
}

function addBio(req, res) {
    console.log('masuk addBio')
    Biodata.read({}, limit, 1, () => res.render('form', { biodata: [{}], id: -1 }))
}

function createBio(req, res) {
    console.log('masuk createBio')
    let params = new URLSearchParams(req.body);
    console.log(req.body)
    let name = req.body.name;
    let height = req.body.height;
    let weight = req.body.weight;
    let married = JSON.parse(params.get('married')) || false;
    let birthdate = req.body.birthdate;
    Biodata.create({ name, height, weight, married, birthdate }, () => res.redirect('/'));
}

function editBio(req, res) {
    console.log('masuk editBio')
    let id = Number(req.params.id);
    Biodata.read({}, -1, 1, (biodata) => {
        res.render('form', { biodata, id })
    })
}

function updateBio(req, res) {
    console.log('masuk updateBio')
    // console.log('masuk post /edit')
    let id = Number(req.params.id);
    let name = req.body.name;
    let height = req.body.height;
    let weight = req.body.weight;
    let married = JSON.parse(req.body.married);
    let birthdate = req.body.birthdate;
    Biodata.update({ name, height, weight, married, birthdate }, id, () => res.redirect('/'));
}

function deleteBio(req, res) {
    console.log('masuk deleteBio')
    let id = Number(req.params.id);
    Biodata.delete(id, () => res.redirect('/'));
}

function resetBio(res, req) {
    console.log('masuk resetBio')
    Biodata.read({}, limit, 1, (biodata, banyak) => {
        // console.log(biodata);
        res.render('index', { biodata, search: {}, page: 1, limit, banyak, url: '/?page=1' })
    });
}

module.exports = { readBio, createBio, addBio, editBio, updateBio, deleteBio, resetBio }