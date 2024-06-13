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
            console.log(err);
        }
    }

    static editAvatar(id, avatar, callback) {
        try {
            sql = `INSERT INTO users(avatar) VALUES ($1) WHERE id = $2`;
            db.query(sql, [avatar, id], (err) => {
                if (err) throw err;
                callback();
            })
        } catch (err) {
            console.log(err);
        }
    }


}

module.exports = User;