const { db } = require('./pg')

class User {
    static async add(email, password) {
        try {
            let sql = `INSERT INTO users(email, password) VALUES ($1,$2)`;
            await db.query(sql, [email, password]);
        } catch (error) {
            console.log(err, 'gagal tambah users');
        }
    }

    static async cek(email) {
        try {
            let sql = `SELECT * FROM users WHERE email = $1`;
            const result = await db.query(sql, [email]);
            return result.rows;
        } catch (error) {
            console.log(error, 'gagal baca users')
        }
    }

    // static editAvatar(userid, avatar, callback) {
    //     try {
    //         let sql = `UPDATE users SET avatar = $1 WHERE userid = $2`;
    //         db.query(sql, [avatar, userid], (err) => {
    //             if (err) throw err;
    //             callback();
    //         })
    //     } catch (err) {
    //         console.log(err, 'gagal edit avatar');
    //     }
    // }
}

module.exports = User;