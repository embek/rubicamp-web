const { db } = require('./pg')

class User {
    static add(email, password, callback) {
        try {
            sql = `INSERT INTO users(email, password) VALUES ($1,$2)`;
            db.query(sql, [email, password], (err) => {
                if (err) throw err;
                callback();
            })
        } catch (error) {
            console.log(err, 'gagal tambah users');
        }
    }

    static cek(callback) {
        try {
            sql = `SELECT * FROM users`
            db.query(sql, (error, result) => {
                if (error) throw error;
                callback(result.rows);
            })
        } catch (error) {
            console.log(error, 'gagal baca users')
        }
    }

    static editAvatar(userid, avatar, callback) {
        try {
            sql = `INSERT INTO users(avatar) VALUES ($1) WHERE userid = $2`;
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