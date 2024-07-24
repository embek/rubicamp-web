const { db } = require('./pg')

class Unit {
    static async add(objectData) {
        try {
            let params = [objectData.unit, objectData.name, objectData.note];
            let sql = `INSERT INTO units(unit,name,note) VALUES ($1,$2,$3)`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah units');
        }
    }

    static async edit(objectData) {
        try {
            let params = [objectData.name, objectData.note, objectData.unit];
            let sql = `UPDATE units SET name = $1, note = $2 WHERE unit = $3`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal edit units');
        }
    }

    static async list(query) {
        try {
            let sql = `SELECT * FROM units`;
            if (query.search.value) sql += ` WHERE name LIKE '%${query.search.value}%' OR unit LIKE '%${query.search.value}%' OR note LIKE '%${query.search.value}%'`;
            const limit = query.length;
            const offset = query.start;
            const sortBy = query.columns[query.order[0].column].data;
            const sortMode = query.order[0].dir;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            sql += ` ORDER BY ${sortBy} ${sortMode}`;
            if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset}`;
            const result = await db.query(sql);
            result.rows.forEach(data => {
                data.action = `<a class="btn btn-success btn-circle" href="/units/edit/${data.unit}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete(${data.unit})"><i class="fas fa-trash"></i></a>`;
            })
            const response = {
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": total.rows[0].total,
                "data": result.rows
            }
            return response;
        } catch (err) {
            console.log(err, 'gagal baca units');
        }
    }

    static async hapus(unit) {
        try {
            let sql = `DELETE FROM units WHERE unit = $1`;
            await db.query(sql, [unit]);
        } catch (err) {
            console.log(err, 'gagal hapus units');
        }
    }
}

module.exports = Unit;