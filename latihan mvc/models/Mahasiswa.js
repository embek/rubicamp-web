const { db } = require('./connect.js');

class Mahasiswa {
    static daftarMahasiswa(callback) {
        let sql = 'SELECT nim,nama_mahasiswa,tgl_lahir,alamat,kode_jurusan,nama_jurusan FROM mahasiswa LEFT JOIN jurusan USING(kode_jurusan)';
        db.all(sql, (err, rows) => {
            if (err) console.log(err, `Gagal cetak daftar mahasiswa\n`)
            else callback(rows);
        })
    }

    static cariMahasiswa(identitas, callback) {
        let sql = `SELECT * FROM mahasiswa WHERE nim = '${identitas}'`
        db.all(sql, (err, rows) => {
            if (err) console.log('Gagal cari data\n')
            else if (rows.length == 0) {
                console.log(`Mahasiswa dengan NIM ${identitas}, tidak terdaftar\n`);
                callback();//
            } else {
                console.log(`Detail mahasiswa dengan NIM ${identitas} :`);
                callback(rows);
            }
            // console.log(garis);
        })
    }

    static tambahMahasiswa(arrayData = [], callback) {
        let sql = `INSERT INTO mahasiswa VALUES ('${arrayData.join(`','`)}')`;
        db.run(sql, (err) => {
            if (err) {
                console.log('Gagal tambah data mahasiswa\n');
                callback()
            } else {
                console.log(`Mahasiswa telah ditambahkan ke database\n`);
                // console.log(garis);
                callback();
            }
        })
    }

    static hapusMahasiswa(identitas, callback) {
        let sql = `DELETE FROM mahasiswa WHERE nim = '${identitas}'`;
        db.run(sql, err => {
            if (err) console.log('Gagal hapus data mahasiswa\n')
            else console.log(`Data mahasiswa dengan NIM ${identitas} telah dihapus\n`);
            // console.log(garis);
            callback();
        })
    }
}

module.exports = Mahasiswa;