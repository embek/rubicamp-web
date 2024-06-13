const { db } = require('./connect')

class Biodata {
    static read(search, limit, page, callback) {
        try {
            console.log('masuk read')
            let offset = (page - 1) * limit;
            let sql = `SELECT * FROM biodata`;
            if (Object.keys(search).length > 1) sql += ` WHERE `
            let ada = true;
            if (typeof search.date1 == 'undefined' || typeof search.date2 == 'undefined') ada = false;
            for (let x in Object.keys(search)) {
                if (x != 0 && x != Object.keys(search).length - 1) {
                    if (ada && Object.keys(search)[x] == 'date2') sql += ` AND `
                    else sql += ` ${search.operation} `;
                }
                if (ada && Object.keys(search)[x] == 'date1') sql += '(';
                if (Object.keys(search)[x] == 'name') sql += ` name like '%${search.name}%' `;
                if (Object.keys(search)[x] == 'height') sql += ` height = ${search.height} `;
                if (Object.keys(search)[x] == 'weight') sql += ` weight = ${search.weight} `;
                if (Object.keys(search)[x] == 'date1') sql += ` birthdate >= '${search.date1}' `;
                if (Object.keys(search)[x] == 'date2') sql += ` birthdate <= '${search.date2}' `;
                if (Object.keys(search)[x] == 'married') sql += ` married = ${search.married} `;
                if (ada && Object.keys(search)[x] == 'date2') sql += ')';
            }
            console.log(sql);
            db.all(sql, (err, rows) => {
                if (err) throw err;
                let banyak = rows.length;
                if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset}`;
                db.all(sql, (err, rows) => {
                    if (err) throw err;
                    callback(rows, banyak);
                })
            })
        } catch (err) {
            console.log(err);
        }
    }

    static create(biodatum, callback) {
        try {
            console.log('masuk create')
            let sql = `INSERT INTO biodata(name,height,weight,birthdate,married) VALUES (?,?,?,?,?)`
            db.run(sql, [biodatum.name, biodatum.height, biodatum.weight, biodatum.birthdate, biodatum.married], (err, rows) => {
                if (err) throw err;
                callback();
            })
        } catch (err) {
            console.log(err);
        }
    }

    static update(biodatum, id, callback) {
        try {
            console.log('masuk update')
            let sql = `UPDATE biodata SET name=?,height=?,weight=?,birthdate=?,married=? WHERE id=?`
            db.run(sql, [biodatum.name, biodatum.height, biodatum.weight, biodatum.birthdate, biodatum.married, id], (err) => {
                if (err) throw err;
                callback();
            })
        } catch (err) {
            console.log(err);
        }
    }

    static delete(id, callback) {
        try {
            console.log('masuk delete')
            let sql = `DELETE FROM biodata WHERE id=?`
            db.run(sql, [id], (err) => {
                if (err) throw err;
                callback();
            })
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Biodata;

