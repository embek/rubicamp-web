const { db } = require('./connect.js');


class Dosen {
    static daftarDosen(callback = () => { }) {
        let sql = 'SELECT nip,nama_dosen FROM dosen';
        db.all(sql, (err, rows) => {
            if (err) console.log(`Gagal cetak daftar dosen\n`)
            else callback(rows)
        })
    }

    static cariDosen(identitas, callback) {
        let sql = `SELECT * FROM dosen WHERE nip = '${identitas}'`
        db.all(sql, (err, rows) => {
            if (err) console.log('gagal cari data dosen\n')
            else if (rows.length == 0) {
                console.log(`Dosen dengan NIP ${identitas} tidak terdaftar\n`);
                callback();
            } else {
                console.log(`Detail dosen dengan NIP ${identitas} :`);
                callback(rows);
            }
            // console.log(garis);
        })
    }

    static tambahDosen(arrayData = [], callback) {
        let sql = `INSERT INTO dosen VALUES ('${arrayData.join(`','`)}')`;
        db.run(sql, (err) => {
            if (err) {
                console.log('Gagal tambah data dosen\n');
                callback()
            } else {
                console.log(`Dosen telah ditambahkan ke database\n`);
                // console.log(garis);
                callback();
            }
        })
    }

    static hapusDosen(identitas, callback = () => { }) {
        let sql = `DELETE FROM dosen WHERE nip = '${identitas}'`;
        db.run(sql, err => {
            if (err) console.log('Gagal hapus data dosen\n')
            else console.log(`Data dosen dengan NIP ${identitas} telah dihapus\n`);
            // console.log(garis);
            callback();
        })
    }
}

module.exports = Dosen;