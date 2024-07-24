var express = require('express');
var router = express.Router();
const Unit = require('../models/Unit')
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', (req, res) => {
    res.render('units/listunits', { name: req.session.userid.name });
})

router.get('/add', (req, res) => {
    res.render('units/addunits', { name: req.session.userid.name });
})

router.post('/add', async (req, res) => {
    try {
        await Unit.add(req.body);
        res.redirect('/units');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/edit/:unit', async (req, res) => {
    try {
        const data = await Unit.cek(req.params.unit);
        res.render('units/editunits', { name: req.session.userid.name, data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

})

router.post('/edit/:unit', async (req, res) => {
    try {///unitnya ganti ,jadi pake property unit lama dalam objectData
        console.log(req.body);
        await Unit.edit({ lama: req.params.unit, ...req.body });
        res.redirect('/units');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data', async (req, res) => {
    try {
        const response = await Unit.list(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/delete/:unit', async (req, res) => {
    try {
        await Unit.hapus(req.params.unit);
        res.redirect('/units');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;
