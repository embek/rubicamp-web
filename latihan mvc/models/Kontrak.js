import data from './connect.js';
const { db } = data;
import universityController from `../controllers/universityController.js`;
const { cetak, ubahOpsi, daftar } = universityController;

class Kontrak {
    static daftarKontrak(callback = () => { }) {
        let sql = 'SELECT nim,nama_mahasiswa,nama_matkul,nama_dosen,nilai FROM kontrak LEFT JOIN dosen USING(nip)';
        db.all(sql, (err, rows) => {
            if (err) console.log(err, `gagal cetak daftar kontrak`)
            else cetak(rows, callback)
        })
    }

    static cariKontrak(identitas, callback = () => { }) {
        let sql = `SELECT * FROM kontrak WHERE nim = '${identitas}'`;
        db.all(sql, (err, rows) => {
            if (err) {
                console.log('gagal cari data');
                callback();
            } else if (rows.length == 0) {
                console.log(`Kontrak mahasiswa dengan NIM ${identitas}, tidak terdaftar`)
                callback();
            } else {
                sql = `SELECT id,nim,kode_matkul,nip,nilai FROM kontrak WHERE nim = '${identitas}'`;
                console.log(`Daftar kontrak mahasiswa dengan NIM ${identitas} adalah :`)
                db.all(sql, (err, rows) => {
                    if (err) console.log(err, `gagal cetak daftar kontrak`)
                    else cetak(rows, callback)
                })
            }
        })
    }

    static tambahKontrak(arrayData = [], callback = () => { }) {
        let sql = `INSERT INTO kontrak(nim,kode_matkul,nip) VALUES ('${arrayData.join(`','`)}')`;
        db.run(sql, (err) => {
            if (err) {
                console.log('gagal tambah data');
                callback();
            } else {
                console.log(`kontrak telah ditambahkan`);
                sql = `SELECT id,nim,nama_mahasiswa,nama_matkul,nama_dosen,nilai FROM kontrak LEFT JOIN mahasiswa USING(nim) LEFT JOIN matakuliah USING(kode_matkul) LEFT JOIN dosen USING(nip)`;
                db.all(sql, (err, rows) => {
                    if (err) console.log(err, `gagal cetak daftar kontrak`)
                    else cetak(rows, callback)
                })
            }
        })
    }

    static updateNilai(id, nilai, callback = () => { }) {
        let sql = `UPDATE kontrak SET nilai='${nilai}' WHERE id='${id}'`;
        db.run(sql, (err) => {
            if (err) console.log('gagal update nilai')
            else {
                console.log(`nilai telah diupdate`);
                sql = 'SELECT nim,nama_mahasiswa,nama_matkul,nama_dosen,nilai FROM kontrak LEFT JOIN dosen USING(nip)';
                db.all(sql, (err, rows) => {
                    if (err) console.log(err, `gagal cetak daftar kontrak`)
                    else cetak(rows, callback)
                })
            }
        })
    }

    static hapusKontrak(identitas, callback = () => { }) {
        let sql = `DELETE FROM kontrak WHERE id = '${identitas}'`;
        db.run(sql, err => {
            if (err) console.log('gagal hapus data')
            else console.log(`Data NIM ${identitas}, telah dihapus`)
            callback();
        })
    }
}

export default Kontrak;
