const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'university.db'));

module.exports = { db };