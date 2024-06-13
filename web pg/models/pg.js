// const { readFileSync, writeFileSync } = require('node:fs');
// const path = require('node:path');
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'biodata.db'));

// const biodata = JSON.parse(readFileSync(path.join(__dirname, '..', 'db', 'biodata.json')))

// function writeBio(biodata, callback) {
//     writeFileSync(path.join(__dirname, '..', 'db', 'biodata.json'), JSON.stringify(biodata))
//     callback();
// }

// module.exports = { db }

const { Pool } = require('pg')

const db = new Pool({
    user: 'adzka',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'workdb',
})

// try {
//     db.query('SELECT NOW()', (err, date) => {
//         if (err) throw err;
//         console.log(date.rows)
//     })
// } catch (err) {
//     console.log(err)
// }

module.exports = { db };

