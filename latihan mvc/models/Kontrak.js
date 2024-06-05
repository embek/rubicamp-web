const { db } = require('./connect.js');


class Kontrak {
    static daftarKontrak(callback = () => { }) {
        let sql = 'SELECT id,nim,nama_mahasiswa,nama_matkul,nama_dosen,nilai FROM kontrak LEFT JOIN mahasiswa USING(nim) LEFT JOIN matakuliah USING(kode_matkul) LEFT JOIN dosen USING(nip)';
        db.all(sql, (err, rows) => {
            if (err) console.log(err, `Gagal cetak daftar kontrak\n`)
            else callback(rows, callback);
        })
    }

    static daftarKontrakNim(nim, callback = () => { }) {
        let sql = `SELECT id,nama_matkul,nilai FROM kontrak LEFT JOIN matakuliah USING(kode_matkul) WHERE nim='${nim}'`;
        db.all(sql, (err, rows) => {
            if (err) console.log(err, `Gagal cetak daftar kontrak berdasarkan NIM\n`)
            else callback(rows);
        })
    }

    static cariKontrak(identitas, callback = () => { }) {
        let sql = `SELECT * FROM kontrak WHERE nim = '${identitas}'`;
        db.all(sql, (err, rows) => {
            if (err) {
                console.log('Gagal cari data kontrak\n');
                callback();
            } else if (rows.length == 0) {
                console.log(`Kontrak mahasiswa dengan NIM ${identitas} tidak terdaftar\n`);
                callback();
            } else {
                sql = `SELECT id,nim,kode_matkul,nip,nilai FROM kontrak WHERE nim = '${identitas}'`;
                console.log(`Daftar kontrak mahasiswa dengan NIM ${identitas} adalah :`)
                db.all(sql, (err, rows) => {
                    if (err) console.log(err, `Gagal cetak daftar kontrak\n`)
                    else callback(rows);
                })
            }
        })
    }

    static tambahKontrak(arrayData = [], callback = () => { }) {
        let sql = `INSERT INTO kontrak(nim,kode_matkul,nip) VALUES ('${arrayData.join(`','`)}')`;
        db.run(sql, (err) => {
            if (err) {
                console.log('Gagal tambah data kontrak\n');
                callback();
            } else {
                sql = `SELECT id,nim,nama_mahasiswa,nama_matkul,nama_dosen,nilai FROM kontrak LEFT JOIN mahasiswa USING(nim) LEFT JOIN matakuliah USING(kode_matkul) LEFT JOIN dosen USING(nip)`;
                db.all(sql, (err, rows) => {
                    if (err) console.log(err, `Gagal cetak daftar kontrak\n`)
                    else {
                        console.log(`Kontrak telah ditambahkan\n`);
                        callback(rows);
                    }
                })
            }
        })
    }

    static updateNilai(id, nilai, callback = () => { }) {
        let sql = `UPDATE kontrak SET nilai='${nilai}' WHERE id='${id}'`;
        db.run(sql, (err) => {
            if (err) console.log('Gagal update nilai\n')
            else {
                console.log(`Nilai telah diupdate`);
                callback();
                // sql = 'SELECT nim,nama_mahasiswa,nama_matkul,nama_dosen,nilai FROM kontrak LEFT JOIN mahasiswa USING(nim) LEFT JOIN matakuliah USING(kode_matkul) LEFT JOIN dosen USING(nip)';
                // db.all(sql, (err, rows) => {
                //     if (err) console.log(err, `Gagal cetak daftar kontrak\n`)
                //     else callback(rows);
                // })
            }
        })
    }

    static hapusKontrak(identitas, callback = () => { }) {
        let sql = `DELETE FROM kontrak WHERE id = '${identitas}'`;
        db.run(sql, err => {
            if (err) console.log('Gagal hapus data\n')
            else console.log(`Data kontrak dengan ID ${identitas} telah dihapus\n`)
            callback();
        })
    }
}

module.exports = Kontrak;