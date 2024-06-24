const moment = require('moment');
const { db } = require('./pg');

class Todo {
    //query mungkin berisi page,limit,sortBy,sortMode,userid search mungkin berisi title,date1,date2,complete,operation
    static readTodo(query, search, callback) {
        try {
            let sql = `SELECT * FROM todos WHERE `;
            let params = [];
            let counter = 0;
            let dua = typeof search.date1 !== 'undefined' && typeof search.date2 !== 'undefined';
            let adaDate = typeof search.date1 !== 'undefined' || typeof search.date2 !== 'undefined';
            let operator = search.operation;
            delete search.operation;
            if (Object.keys(search).length > 0) {
                if (adaDate) {
                    sql += '('
                    if (dua) {
                        counter++;
                        sql += ` deadline >= $${counter} AND`;
                        params.push(search.date1);
                        delete search.date1;
                        counter++;
                        sql += ` deadline <= $${counter}`;
                        params.push(moment(search.date2).add(1, 'day').format('YYYY-MM-DD'));
                        delete search.date2;
                    } else if (typeof search.date1 !== 'undefined') {
                        counter++;
                        sql += ` deadline >= $${counter} `;
                        params.push(search.date1);
                        delete search.date1;
                    } else if (typeof search.date2 !== 'undefined') {
                        counter++;
                        sql += ` deadline <= $${counter}`;
                        params.push(moment(search.date2).add(1, 'day').format('YYYY-MM-DD'));
                        delete search.date2;
                    }
                    sql += ') '
                }
                if (Object.keys(search).length > 0) {
                    if (adaDate) sql += ' AND ('
                    else sql += ' ( ';
                    for (let x in Object.keys(search)) {
                        if (x > 0 && x < Object.keys(search).length) sql += ` ${operator} `;

                        if (Object.keys(search)[x] == 'title') {
                            counter++;
                            sql += ` title like '%' || $${counter} || '%'`;
                            params.push(search.title);
                        }
                        if (Object.keys(search)[x] == 'complete') {
                            counter++;
                            sql += ` complete = $${counter}`;
                            params.push(search.complete);
                        }
                    }
                    sql += ')';
                }
                sql += ' AND ';
            }
            counter++;
            sql += ` userid = $${counter} `;
            params.push(query.userid);
            db.query(sql.replace('*', 'count(*) '), params, (err, result) => {
                console.log(sql, params, 'dalam query pertama');
                if (err) throw err;
                let banyak = result.rows[0].count;
                if (['title', 'complete', 'deadline', 'id'].includes(query.sortBy)) {
                    sql += ` ORDER BY ${query.sortBy} `;
                    if (query.sortMode == 'desc') sql += ` DESC `
                    else sql += ` ASC `;
                } else throw 'sortBy tidak sesuai';
                let offset = (query.page - 1) * query.limit;
                sql += ` LIMIT $${counter + 1} OFFSET $${counter + 2}`;
                params.push(query.limit);
                params.push(offset);
                db.query(sql, params, (error, result) => {
                    console.log(sql, params, 'dalam query kedua')
                    if (error) throw error;
                    // console.table(result.rows);
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
                // console.table(result.rows);
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
            sql += `WHERE id = $${Object.keys(objectData).length + 1}`;
            let arr = Object.values(objectData);
            arr.push(id);
            // console.log(sql, arr);
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