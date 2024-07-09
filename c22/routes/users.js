var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;

module.exports = (db) => {
  const users = db.collection('users');
  router.get('/', async function (req, res, next) {
    try {
      req.query.limit = Number(req.query.limit) || 5;
      req.query.query = req.query.query || '';
      req.query.page = req.query.page || 1;
      req.query.sortBy = req.query.sortBy || '_id';
      req.query.sortMode = req.query.sortMode || 'desc';
      const strSort = `{"${req.query.sortBy}":${req.query.sortMode === 'desc' ? -1 : 1}}`;
      // console.log(strSort);
      const offset = (req.query.page - 1) * req.query.limit;
      const data = await users.find({ name: new RegExp(req.query.query, 'i') }, { "_id": 1, name: 1, phone: 1 }).sort(JSON.parse(strSort)).limit(req.query.limit).skip(offset).toArray();
      const total = await users.count();
      const pages = Math.ceil(total / req.query.limit);
      res.status(200).json({ data, total, pages, page: req.query.page, limit: req.query.limit, offset });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/:id', async function (req, res, next) {
    try {
      const data = await users.findOne({ _id: new ObjectId(req.params.id) }, { _id: 1, name: 1, phone: 1 });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      await users.insertOne({ name: req.body.name, phone: req.body.phone });
      const data = await users.find().sort({ _id: -1 }).limit(1).toArray();
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      await users.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { name: req.body.name, phone: req.body.phone } });
      const data = await users.findOne({ _id: new ObjectId(req.params.id) }, { _id: 1, name: 1, phone: 1 });
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const data = await users.findOne({ _id: new ObjectId(req.params.id) }, { _id: 1, name: 1, phone: 1 });
      await users.deleteOne({ _id: new ObjectId(req.params.id) });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
}
