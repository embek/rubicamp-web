const { db } = require('./connect')

class Biodata {
    static read(callback) {
        try {
            let sql = `SELECT * FROM biodata`;
            db.all(sql, (err, rows) => {
                if (err) throw err;
                callback(rows);
            })
        } catch (err) {
            console.log(err);
        }
    }

    static create(biodatum, callback) {
        try {
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

