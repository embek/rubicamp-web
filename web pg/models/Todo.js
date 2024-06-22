const { db } = require('./pg');

class Todo {
    //query mungkin berisi page,limit,sortBy,sortMode, search mungkin berisi title,date1,date2,complete,operation
    static readTodo(query, search, callback) {
        try {
            console.log(query, search);
            db.query(`SELECT * FROM todos WHERE userid = $1`, [search.userid], (error, result) => {
                if (error) throw error;
                let banyak = result.rows.length;
                let sql = `SELECT * FROM todos WHERE `;
                let params = [];
                let counter = 0;
                let operator = search.operation;
                delete search.operation;
                // let dua = (query.date1) && (query.date2);
                if (Object.keys(search).length > 1) {
                    for (let x in Object.keys(search)) {
                        if (x > 0 && x < Object.keys(search).length - 1) {
                            if (Object.keys(search)[x] == 'date1' || Object.keys(search)[x] == 'date2') sql += ' AND '
                            else if (Object.keys(search)[x - 1] == 'date1' || Object.keys(search)[x - 1] == 'date2') sql += ' AND '
                            else sql += ` ${operator} `;
                        }

                        if (Object.keys(search)[x] == 'title') {
                            // counter++;
                            sql += ` title like '%${search.title}%'`;
                            // params.push(search.title);
                        }
                        if (Object.keys(search)[x] == 'date1') {
                            counter++;
                            sql += ` deadline >= $${counter} `;
                            params.push(search.date1);
                        }
                        if (Object.keys(search)[x] == 'date2') {
                            counter++;
                            sql += ` deadline <= $${counter}`;
                            params.push(search.date2);
                        }
                        if (Object.keys(search)[x] == 'complete') {
                            counter++;
                            sql += ` complete = $${counter}`;
                            params.push(search.complete);
                        }
                    }
                    sql += ' AND '
                }
                counter++;
                sql += ` userid = $${counter} `
                params.push(search.userid)
                if (query.sortMode == 'desc') sql += ` ORDER BY $${counter + 1} DESC `
                else sql += ` ORDER BY $${counter + 1} ASC `;
                params.push(query.sortBy);
                let offset = (query.page - 1) * query.limit;
                sql += ` LIMIT $${counter + 2} OFFSET $${counter + 3}`;
                params.push(query.limit);
                params.push(offset);
                console.log(sql, params);
                db.query(sql, params, (error, result) => {
                    if (error) throw error;
                    console.table(result.rows);
                    callback(result.rows, banyak);
                })
            })
        } catch (error) {
            console.log(error, 'gagal baca todo')
        }
    }

    static addTodo(userid, title, callback) {
        try {
            let sql = `INSERT INTO todos (title,userid) VALUES ($1,$2)`
            db.query(sql, [title, userid], (error) => {
                if (error) throw error;
                callback();
            })
        } catch (error) {
            console.log(error, 'gagal buat todo');
        }
    }

    static readTodoById(id, callback) {
        try {
            let sql = 'SELECT * FROM todos WHERE id = $1';
            let params = [id];
            db.query(sql, params, (error, result) => {
                if (error) throw error;
                callback(result.rows);
            })
        } catch (error) {
            console.log(`gagal ambil data todos dengan id = ${id} `, error)
        }
    }

    //objectData mungkin berisi {title,deadline,complete}
    static updateTodo(id, objectData, callback) {
        try {
            let sql = `UPDATE todos SET `
            let lebih = Object.keys(objectData).length > 1;
            for (let x in Object.keys(objectData)) {
                if (lebih && (x > 0 && x < Object.keys(objectData).length)) sql += ','
                if (Object.keys(objectData)[x] == 'title') sql += ` title = $${Number(x) + 1} `;
                if (Object.keys(objectData)[x] == 'deadline') sql += ` deadline = $${Number(x) + 1} `;
                if (Object.keys(objectData)[x] == 'complete') sql += ` complete = $${Number(x) + 1} `;
            }
            sql += `WHERE id = $${Object.keys(objectData).length+1}`;
            let arr = Object.values(objectData);
            arr.push(id);
            console.log(sql, arr);
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
            let sql = `DELETE FROM todos WHERE id = $1`;
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