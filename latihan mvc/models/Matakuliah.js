const { db } = require('./connect.js');


class Matakuliah {
    static daftarMatakuliah(callback) {
        let sql = 'SELECT * FROM matakuliah';
        db.all(sql, (err, rows) => {
            if (err) console.log(`Gagal cetak daftar matakuliah\n`)
            else callback(rows)
        })
    }

    static cariMatakuliah(identitas, callback = () => { }) {
        let sql = `SELECT * FROM matakuliah WHERE kode_matkul = '${identitas}'`
        db.all(sql, (err, rows) => {
            if (err) console.log('Gagal cari data matakuliah\n')
            else if (rows.length == 0) {
                console.log(`Matakuliah dengan kode matakuliah ${identitas} tidak terdaftar`);
                callback();//
            } else {
                console.log(`Detail matakuliah dengan kode matakuliah ${identitas} :`);
                callback(rows)
            }
            // console.log(garis);
        })
    }

    static tambahMatakuliah(arrayData = [], callback = () => { }) {
        let sql = `INSERT INTO matakuliah VALUES ('${arrayData.join(`','`)}')`;
        db.run(sql, (err) => {
            if (err) {
                console.log('Gagal tambah data matakuliah\n');
                callback()
            } else {
                console.log(`Matakuliah telah ditambahkan ke database\n`);
                // console.log(garis);
                callback();
            }
        })
    }

    static hapusMatakuliah(identitas, callback = () => { }) {
        let sql = `DELETE FROM matakuliah WHERE kode_matkul = '${identitas}'`;
        db.run(sql, err => {
            if (err) console.log('Gagal hapus data')
            else console.log(`Data matakuliah dengan kode matakuliah ${identitas} telah dihapus\n`);
            // console.log(garis);
            callback();
        })
    }
}

module.exports = Matakuliah;