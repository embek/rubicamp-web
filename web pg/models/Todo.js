const { db } = require('./pg');

class Todo {
    static read(userid, callback) {
        try {
            sql = `SELECT * FROM todos WHERE userid = $1`;
            db.query(sql, [userid], (error, result) => {
                if (error) throw error;
                callback(result.rows);
            })
        } catch (error) {
            console.log(error, 'gagal baca todo')
        }
    }

    static add(userid, title, callback) {
        try {
            sql = `INSERT INTO todos (title,userid) VALUES ($1,$2)`
            db.query(sql, [title, userid], (error) => {
                if (error) throw error;
                callback();
            })
        } catch (error) {
            console.log(error, 'gagal buat todo');
        }
    }
    //objectData mungkin berisi {title,deadline,complete}
    static update(id, objectData, callback) {
        try {
            sql = `UPDATE todos SET `
            let lebih = objectData.keys.length > 1;
            for (x in objectData.keys) {
                if (lebih && (x != 0 || x != objectData.keys.length - 1)) sql += ','
                if (objectData.keys[x] == 'title') sql += `title = $${x}`;
                if (objectData.keys[x] == 'deadline') sql += `deadline = $${x}`;
                if (objectData.keys[x] == 'complete') sql += `complete = $${x}`;
            }
            sql += `WHERE id = ${objectData.keys.length}`;
            let arr = objectData.values;
            arr.push(id);
            db.query(sql, arr, (error) => {
                if (error) throw error;
                callback();
            })
        } catch (error) {
            console.log(error, 'gagal update todo')
        }
    }

    static delete(id, callback) {
        try {
            sql = `DELETE FROM todos WHERE id = $1`;
            db.query(sql, [id], (error) => {
                if (error) throw error;
                callback();
            })
        } catch (error) {
            console.log(error, 'gagal hapus todo')
        }
    }
}

module.exports = Todo;