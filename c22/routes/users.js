var express = require('express');
const User = require('../models/User');
var router = express.Router();

module.exports = (db) => {
  const users = db.collection('users');
  router.get('/', async function (req, res, next) {
    try {
      const total = await users.count({ name: `/${req.query}/` });
      const pages = Math.ceil(total / req.limit);
      const data = await users.find({ name: `/${req.query}/` }, { _id: 1, name: 1, phone: 1 }).sort({ _id: -1 }).limit(req.limit).skip((req.page - 1) * req.limit).toArray();
      res.status(200).json({ data, total, pages, page: req.page, limit: req.limit });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/:id', async function (req, res, next) {
    try {
      const data = await users.find({ _id: req.params.id }, { _id: 1, name: 1, phone: 1 });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      await users.insertOne({ name: req.name, phone: req.phone });
      const data = user.find({}, { _id: 1, name: 1, phone: 1 }).sort({ _id: -1 }).limit(1);
      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      await users.updateMany({ _id: req.params.id }, { $set: { name: req.name, phone: req.phone } });
      const data = await users.find({ _id: req.params.id }, { _id: 1, name: 1, phone: 1 });
      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const data = await users.find({ _id: req.params.id }, { _id: 1, name: 1, phone: 1 });
      await users.deleteMany({ _id: req.params.id });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}
