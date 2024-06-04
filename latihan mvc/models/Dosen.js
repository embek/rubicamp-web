import data from './connect.js';
const { db } = data;
import universityController from `../controllers/universityController.js`;
const { cetak, ubahOpsi, daftar } = universityController;

class Dosen {
    static daftarDosen(callback = () => { }) {
        let sql = 'SELECT nip,nama_dosen FROM dosen';
        db.all(sql, (err, rows) => {
            if (err) console.log(`gagal cetak daftar mahasiswa`)
            else cetak(rows, callback)
        })
    }

    static cariDosen(identitas, callback = () => { }) {
        let opsi = 3;
        let sql = `SELECT * FROM ${ubahOpsi(opsi, 'nt')} WHERE ${ubahOpsi(opsi, 'pk')} = '${identitas}'`
        db.all(sql, (err, rows) => {
            // console.log(rows);
            if (err) console.log('gagal cari data')
            else if (rows.length == 0) {
                console.log(`${ubahOpsi(opsi, 'NT')} dengan ${ubahOpsi(opsi, 'kolom')} ${identitas}, tidak terdaftar`)
            } else {
                daftar(rows, callback)
            }
            console.log();
            console.log(garis);
            callback();
        })
    }

    static tambahDosen(arrayData = [], callback = () => { }) {
        let opsi = 3;
        let sql = `INSERT INTO ${ubahOpsi(opsi, 'nt')} VALUES ('${arrayData.join(`','`)}')`;
        db.run(sql, (err) => {
            if (err) {
                console.log('gagal tambah data');
                callback()
            } else if (opsi != 5) {
                console.log(`${ubahOpsi(opsi, 'NT')} telah ditambahkan ke database`);
                console.log(garis);
                callback();
            }
        })
    }

    static hapusDosen(identitas, callback = () => { }) {
        let opsi = 3;
        let sql = `DELETE FROM ${ubahOpsi(opsi, 'nt')} WHERE ${ubahOpsi(opsi, 'pk')} = '${identitas}'`;
        db.run(sql, err => {
            if (err) console.log('gagal hapus data')
            else console.log(`Data ${ubahOpsi(opsi, 'NT')} ${identitas}, telah dihapus`)
            console.log();
            console.log(garis);
            callback();
        })
    }
}

export default Dosen;