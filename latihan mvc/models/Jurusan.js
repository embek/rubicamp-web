const { db } = require('./connect.js');

class Jurusan {
    static daftarJurusan(callback) {
        let sql = 'SELECT * FROM jurusan';
        db.all(sql, (err, rows) => {
            if (err) console.log(`Gagal cetak daftar mahasiswa\n`)
            else callback(rows);
        })
    }

    static cariJurusan(identitas, callback) {
        let sql = `SELECT * FROM jurusan WHERE kode_jurusan = '${identitas}'`
        db.all(sql, (err, rows) => {
            if (err) console.log('Gagal cari data jurusan\n')
            else if (rows.length == 0) {
                console.log(`Jurusan dengan kode jurusan ${identitas} tidak terdaftar\n`);
                callback();
            } else {
                console.log(`Detail jurusan dengan kode jurusan ${identitas} :`);
                callback(rows);
            }
            // console.log(garis);
        })
    }

    static tambahJurusan(arrayData = [], callback) {
        let sql = `INSERT INTO jurusan VALUES ('${arrayData.join(`','`)}')`;
        db.run(sql, (err) => {
            if (err) {
                console.log('Gagal tambah data jurusan\n');
                callback()
            } else {
                console.log(`Jurusan telah ditambahkan ke database\n`);
                callback();
            }
        })
    }

    static hapusJurusan(identitas, callback) {
        let sql = `DELETE FROM jurusan WHERE kode_jurusan = '${identitas}'`;
        db.run(sql, err => {
            if (err) console.log('Gagal hapus data jurusan\n')
            else console.log(`Data jurusan dengan kode jurusan ${identitas}, telah dihapus\n`);
            // console.log(garis);
            callback();
        })
    }
}

module.exports = Jurusan;