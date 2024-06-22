const { db } = require('./pg')

class User {
    static add(email, password, callback) {
        try {
            let sql = `INSERT INTO users(email, password) VALUES ($1,$2)`;
            db.query(sql, [email, password], (err) => {
                if (err) throw err;
                callback();
            })
        } catch (error) {
            console.log(err, 'gagal tambah users');
        }
    }

    static cek(email, callback) {
        try {
            let sql = `SELECT * FROM users WHERE email = $1`
            console.log(sql, email);
            db.query(sql, [email], (error, result) => {
                if (error) throw error;
                // console.log(result.rows)
                callback(result.rows);
            })
        } catch (error) {
            console.log(error, 'gagal baca users')
        }
    }

    static editAvatar(userid, avatar, callback) {
        try {
            let sql = `UPDATE users SET avatar = $1 WHERE userid = $2`;
            db.query(sql, [avatar, userid], (err) => {
                if (err) throw err;
                callback();
            })
        } catch (err) {
            console.log(err, 'gagal edit avatar');
        }
    }
}

module.exports = User;