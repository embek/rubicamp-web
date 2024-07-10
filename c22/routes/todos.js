var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
const moment = require("moment/moment");

module.exports = (db) => {
    const todos = db.collection('todos');
    router.get('/', async function (req, res, next) {
        try {
            req.query.limit = Number(req.query.limit) || 5;
            req.query.page = Number(req.query.page) || 1;
            req.query.title = req.query.title || '';
            req.query.sortBy = req.query.sortBy || '_id';
            req.query.sortMode = req.query.sortMode || 'desc';
            let query = [];
            query.push({ executor: req.query.executor });
            req.query.title ? query.push({ title: new RegExp(req.query.title) }) : '';
            if (req.query.endDateDeadline && req.query.startDateDeadline) query.push({ deadline: { $lt: req.query.endDateDeadline, $gt: req.query.startDateDeadline } })
            else if (req.query.endDateDeadline) query.push({ deadline: { $lt: req.query.endDateDeadline } })
            else if (req.query.startDateDeadline) query.push({ deadline: { $gt: req.query.startDateDeadline } });
            typeof req.query.complete !== 'undefined' ? query.push({ complete: JSON.parse(req.query.complete) }) : '';
            let sort = `{"${req.query.sortBy}":${req.query.sortMode == 'desc' ? -1 : 1}}`;
            const total = await todos.count({ $and: query });
            const pages = Math.ceil(total / req.query.limit);
            const data = await todos.find({ $and: query }, { _id: 1, title: 1, complete: 1, deadline: 1, executor: 1 }).sort(JSON.parse(sort)).limit(req.query.limit).skip((req.query.page - 1) * req.query.limit).toArray();
            res.status(200).json({ data, total, pages, page: req.query.page, limit: req.query.limit })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

    router.get('/:id', async function (req, res, next) {
        try {
            const data = await todos.findOne({ _id: new ObjectId(req.params.id) }, { _id: 1, title: 1, complete: 1, deadline: 1, executor: 1 });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    router.post('/', async function (req, res, next) {
        try {
            await todos.insertOne({ title: req.body.title, executor: req.body.executor, complete: false, deadline: moment(Date.now()).add(1, 'day').toISOString() });
            const data = await todos.find().sort({ _id: -1 }).limit(1).toArray();
            res.status(201).json(data[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    router.put('/:id', async function (req, res, next) {
        try {
            await todos.updateOne({ _id: new ObjectId(req.params.id) }, { title: req.body.title, deadline: req.body.deadline, complete: req.body.complete });
            const data = await todos.findOne({ _id: new ObjectId(req.params.id) }, { _id: 1, title: 1, complete: 1, deadline: 1, executor: 1 });
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    router.delete('/:id', async function (req, res, next) {
        try {
            const data = await todos.findOne({ _id: new ObjectId(req.params.id) }, { _id: 1, title: 1, complete: 1, deadline: 1, executor: 1 });
            await users.deleteOne({ _id: new ObjectId(req.params.id) });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    return router;
};
