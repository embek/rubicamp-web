import data from './connect.js';
const { db } = data;

class Users {
    cek(answer, username = '', callback) {
        if (typeof arguments[1] === 'function') {
            let sql = `SELECT * FROM users WHERE username = '${answer}'`;
            db.all(sql, (err, rows) => {
                if (err) callback(err)
                else if (rows.length == 0) callback(err, false)
                else callback(err, true);
            })
        } else {
            let sql = `SELECT pass FROM users WHERE username = '${username}'`;
            db.all(sql, (err, rows) => {
                if (err) callback(err)
                else if (rows.length == 0) callback(err, false)
                else callback(err, true, rows[0].peran);
            })
        }
    }
}

export default Users;