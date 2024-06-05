const { db } = require('./connect.js');

class Users {
    static cekUser(answer, callback = () => { }) {
        let sql = `SELECT * FROM users WHERE username = '${answer}'`;
        db.all(sql, (err, rows) => {
            if (err) console.log('gagal cek data username')
            if (rows.length == 0) callback(false)
            else callback(true);
        })
    }

    static cekPass(answer, username, callback = () => { }) {
        let sql = `SELECT * FROM users WHERE username = '${username}' AND pass = '${answer}'`;
        db.all(sql, (err, rows) => {
            if (err) console.log('gagal cek data password')
            else if (rows.length == 0) callback(false)
            else if (answer == rows[0].pass) callback(true, rows[0].peran);
        })
    }
}

module.exports = Users;