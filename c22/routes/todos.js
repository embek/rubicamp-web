var express = require('express');
const Todo = require('../models/Todo');
var router = express.Router();

module.exports = (db) => {
    const todos = db.collection('todos');
    router.get('/', async function (req, res, next) {
        try {
            const total = await todos.find({ $and: [{ executor: req.executor }, { title: `/${req.title}/` }, { deadline: { $lt: endDeadline, $gt: startDeadline } }, { complete: req.complete },] });
            const pages = Math.ceil(total / req.limit);
            const data = await todos.find({ $and: [{ executor: req.executor }, { title: `/${req.title}/` }, { deadline: { $lt: endDeadline, $gt: startDeadline } }, { complete: req.complete },] }, { _id: 1, title: 1, complete: 1, deadline: 1, executor: 1 }).sort({ _id: -1 }).limit(req.limit).skip((req.page - 1) * req.limit).toArray();
            res.status(200).json({ data, total, pages, page: req.page, limit: req.limit })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

    router.get('/:id', async function (req, res, next) {
        try {
            const data = await todos.find({ _id: req.params.id }, { _id: 1, title: 1, complete: 1, deadline: 1, executor: 1 }).toArray();
            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    router.post('/', async function (req, res, next) {
        try {
            await todos.insertOne({ title: req.title, executor: req.executor });
            const data = await todos.find({}, { _id: 1, title: 1, complete: 1, deadline: 1, executor: 1 }).sort({ _id: -1 }).limit(1);
            res.status(201).json({ data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    router.put('/:id', async function (req, res, next) {
        try {
            await todos.updateMany({ _id: req.params.id }, { title: req.title, deadline: req.deadline, complete: req.complete });
            const data = await todos.find({ _id: req.params.id }, { _id: 1, title: 1, complete: 1, deadline: 1, executor: 1 });
            res.status(201).json({ data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    router.delete('/:id', async function (req, res, next) {
        try {
            const data = await todos.find({ _id: req.params.id }, { _id: 1, title: 1, complete: 1, deadline: 1, executor: 1 });
            await users.deleteMany({ _id: req.params.id });
            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};
