const { db } = require('./pg');

class Todo {
    //query mungkin berisi page,limit,sortBy,sortMode, searchTitle,searchDate1,searchDate2,searchComplete,search.operation
    static readTodo(query, callback) {
        try {
            let sql = `SELECT * FROM todos WHERE`;
            let params = [];
            let counter = 0;
            let dua = (search.date1) && (search.date2);
            sql += ' ( ';
            if (query.title) {
                counter++;
                sql += ` title = $${counter} `;
                params.push(query.title);
            }
            if (query.date1) {
                counter++;
                sql += ` deadline >= $${counter} `;
                params.push(query.date1);
            }
            if (query.date2) {
                counter++;
                sql += ` deadline <= $${counter}`;
                params.push(query.date2);
            }
            if (query.complete) {
                counter++;
                sql += ` complete = $${counter}`;
                params.push(query.complete);
            }
            if (query.userid) {
                counter++;
                sql += ` userid = $${counter}`;
                params.push(query.userid);
            }

            sql += ` ORDER BY $${counter + 1} $${counter + 2} `;
            params.push(query.sortBy).push(query.sortMode);
            let offset = (query.page - 1) * query.limit;
            sql += ` LIMIT $${counter + 3} OFFSET $${counter + 4}`;
            params.push(query.limit).push(offset);

            db.query(sql, params, (error, result) => {
                if (error) throw error;
                callback(result.rows);
            })
        } catch (error) {
            console.log(error, 'gagal baca todo')
        }
    }

    static addTodo(userid, title, callback) {
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
    static updateTodo(id, objectData, callback) {
        try {
            sql = `UPDATE todos SET `
            let lebih = objectData.keys.length > 1;
            for (x in objectData.keys) {
                if (lebih && (x != 0 || x != objectData.keys.length - 1)) sql += ','
                if (objectData.keys[x] == 'title') sql += `title = $${x+1}`;
                if (objectData.keys[x] == 'deadline') sql += `deadline = $${x+1}`;
                if (objectData.keys[x] == 'complete') sql += `complete = $${x+1}`;
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

    static deleteTodo(id, callback) {
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