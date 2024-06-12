const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'biodata.db'));

const biodata = JSON.parse(readFileSync(path.join(__dirname, '..', 'db', 'biodata.json')))

function writeBio(biodata, callback) {
    writeFileSync(path.join(__dirname, '..', 'db', 'biodata.json'), JSON.stringify(biodata))
    callback();
}

module.exports = { db }

