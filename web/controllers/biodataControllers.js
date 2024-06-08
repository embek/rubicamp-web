const Biodata = require('../models/Biodata');

function readBio(req, res) {
    console.log('masuk readBio')
    Biodata.read((biodata) => {
        res.render('index', { biodata })
    });
}

function addBio(req, res) {
    console.log('masuk addBio')
    Biodata.read(() => res.render('form', { biodata: {}, id: -1 }))
}

function createBio(req, res) {
    console.log('masuk createBio')
    let params = new URLSearchParams(req.body);
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
    Biodata.read((biodata) => {
        // console.log(biodata, id, biodata[id]);
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

module.exports = { readBio, createBio, addBio, editBio, updateBio, deleteBio }