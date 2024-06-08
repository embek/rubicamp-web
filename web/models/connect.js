const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const biodata = JSON.parse(readFileSync(path.join(__dirname, '..', 'db', 'biodata.json')))

function writeBio(biodata, callback) {
    writeFileSync(path.join(__dirname, '..', 'db', 'biodata.json'), JSON.stringify(biodata))
    callback();
}

module.exports = { writeBio, biodata }
