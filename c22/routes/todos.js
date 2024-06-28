var express = require('express');
const Todo = require('../models/Todo');
var router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        const data = await Todo.readTodo(req.query);
        res.status(200).json({ data, total, pages, page: req.query.page, limit: req.query.limit })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const data = await Todo.getTodo(req.params.id);
        res.status(200).json({ data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/', async function (req, res, next) {
    try {
        const data = await Todo.addTodo(req.body);
        res.status(201).json({ data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const data = await Todo.updateTodo(req.params.id);
        res.status(201).json({ data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        const data = await Todo.removeTodo(req.params.id);
        res.status(200).json({ data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;
