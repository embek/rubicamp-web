const sqlite3 = require('sqlite3')
const { readFileSync } = require('node:fs')
const db = new sqlite3.Database('biodata.db')

const biodata = JSON.parse(readFileSync('biodata.json', 'utf-8'))

biodata.forEach((element) => {
    let sql = `INSERT INTO biodata(name,height,weight,birthdate,married) VALUES ('${element.name}',${element.height},${element.weight},'${element.birthdate}',${element.married})`
    db.run(sql, (err) => err ? console.log(err) : '')
    // console.log(sql)
})