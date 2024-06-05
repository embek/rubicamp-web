const Table = require('cli-table');
const Mahasiswa = require('./../models/Mahasiswa.js');
const Jurusan = require('./../models/Jurusan.js');
const Dosen = require('./../models/Dosen.js');
const Matakuliah = require('./../models/Matakuliah.js');
const Kontrak = require('./../models/Kontrak.js');

function cetakData(rows, callback) {
    // console.log('masuk cetak data');
    Object.keys(rows[0]).forEach(key => console.log(`${ubahKolom(key)} : ${rows[0][key]}`));
    console.log();
    callback();
}

function cetakTabel(rows, callback = () => { }) {
    // console.log('masuk cetak tabel');
    var judul = [];
    Object.keys(rows[0]).forEach(nama_kolom => judul.push(ubahKolom(nama_kolom)));
    var table = new Table({
        head: judul
    });
    rows.forEach(baris => table.push(Object.values(baris).map(nilai => nilai != null ? nilai : '')))
    console.log(table.toString());
    console.log();
    callback();
}

function daftar(opsi, nim = '', callback) {
    // console.log('masuk daftar');
    if (typeof arguments[1] === 'function') {
        switch (opsi) {
            case 1: Mahasiswa.daftarMahasiswa((rows) => cetakTabel(rows, arguments[1]));
                break;
            case 2: Jurusan.daftarJurusan((rows) => cetakTabel(rows, arguments[1]));
                break;
            case 3: Dosen.daftarDosen((rows) => cetakTabel(rows, arguments[1]));
                break;
            case 4: Matakuliah.daftarMatakuliah((rows) => cetakTabel(rows, arguments[1]));
                break;
            case 5: Kontrak.daftarKontrak((rows) => cetakTabel(rows, arguments[1]));
                break;
        }
    } else Kontrak.daftarKontrakNim(nim, (rows) => cetakTabel(rows, arguments[2]));
}

function cari(opsi, identitas, callback) {
    // console.log('masuk cari');
    switch (opsi) {
        case 1: Mahasiswa.cariMahasiswa(identitas, (rows) => rows ? cetakData(rows, callback) : callback());
            break;
        case 2: Jurusan.cariJurusan(identitas, (rows) => rows ? cetakData(rows, callback) : callback());
            break;
        case 3: Dosen.cariDosen(identitas, (rows) => rows ? cetakData(rows, callback) : callback());
            break;
        case 4: Matakuliah.cariMatakuliah(identitas, (rows) => rows ? cetakData(rows, callback) : callback());
            break;
        case 5: Kontrak.cariKontrak(identitas, (rows) => rows ? cetakTabel(rows, callback) : callback());
            break;
        default: callback();
    }
}

function tambah(opsi, arrayData, callback) {
    // console.log('masuk tambah');
    switch (opsi) {
        case 1: Mahasiswa.tambahMahasiswa(arrayData, callback);
            break;
        case 2: Jurusan.tambahJurusan(arrayData, callback);
            break;
        case 3: Dosen.tambahDosen(arrayData, callback);
            break;
        case 4: Matakuliah.tambahMatakuliah(arrayData, callback);
            break;
        case 5: Kontrak.tambahKontrak(arrayData, (rows) => cetakTabel(rows, callback));
            break;
        default: callback();
    }
}


function hapus(opsi, identitas, callback) {
    // console.log('masuk hapus');
    switch (opsi) {
        case 1: Mahasiswa.hapusMahasiswa(identitas, callback);
            break;
        case 2: Jurusan.hapusJurusan(identitas, callback);
            break;
        case 3: Dosen.hapusDosen(identitas, callback);
            break;
        case 4: Matakuliah.hapusMatakuliah(identitas, callback);
            break;
        case 5: Kontrak.hapusKontrak(identitas, callback);
            break;
        default: callback();
    }
}

function update(id, nilai, callback) {
    // console.log('masuk update');
    Kontrak.updateNilai(id, nilai, callback);
}


function validasi(answer, tipe, callback) {
    // console.log('masuk validasi');
    switch (tipe) {
        case 'nim':
            if (answer.length != 10) {
                console.log('Format NIM salah')
                callback(false);
            } else callback(true);
            break;
        case 'tgl_lahir':
            let dateRegex = /(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0-1])/;
            if (answer.length != 10 || !dateRegex.test(answer)) {
                console.log('Format tanggal lahir salah')
                callback(false);
            } else callback(true);
            break;
        case 'kode_jurusan':
            if (answer.length != 4) {
                console.log('Format kode jurusan salah')
                callback(false);
            } else callback(true);
            break;
        case 'nip':
            if (answer.length != 5) {
                console.log('Format NIP salah')
                callback(false);
            } else callback(true);
            break;
        case 'kode_matkul':
            if (answer.length != 4) {
                console.log('Format kode matakuliah salah')
                callback(false);
            } else callback(true);
            break;
        case 'sks':
            if (parseInt(answer) != answer) {
                console.log('Format SKS salah')
                callback(false);
            } else callback(true);
            break;
        case 'nilai':
            if (answer.length > 3) {
                console.log('Format nilai salah')
                callback(false);
            } else callback(true);
            break;
        case 'opsi':
            if (answer.length > 1 && parseInt(answer) != answer) {
                console.log('Format opsi salah')
                callback(false);
            } else callback(true);
            break;
        case 'id':
            if (parseInt(answer) != answer) {
                console.log('Format id salah')
                callback(false);
            } else callback(true);
            break;
        default: callback(true);
    }
}

function ubahKolom(nama_kolom) {
    switch (nama_kolom) {
        case 'nim': return 'NIM';
        case 'nama_mahasiswa': return 'Nama Mahasiswa';
        case 'tgl_lahir': return 'Tanggal Lahir';
        case 'alamat': return 'Alamat';
        case 'kode_jurusan': return 'Kode Jurusan';
        case 'nama_jurusan': return 'Nama Jurusan';
        case 'id': return 'ID';
        case 'nip': return 'NIP';
        case 'nama_dosen': return 'Nama Dosen';
        case 'nilai': return 'Nilai';
        case 'kode_matkul': return 'Kode Matakuliah';
        case 'nama_matkul': return 'Nama Matakuliah';
        case 'sks': return 'SKS';
        default: return nama_kolom;
    }
}

function ubahOpsi(opsi, tipe) {
    switch (tipe) {
        case 'NT':
            switch (opsi) {
                case 1: return 'Mahasiswa';
                case 2: return 'Jurusan';
                case 3: return 'Dosen';
                case 4: return 'Matakuliah';
                case 5: return 'Kontrak';
            }
            break;
        case 'pk':
            switch (opsi) {
                case 1: return 'nim';
                case 2: return 'kode_jurusan';
                case 3: return 'nip';
                case 4: return 'kode_matkul';
                case 5: return 'id';
            }
            break;
        case 'nt':
            return ubahOpsi(opsi, 'NT').toLowerCase();
        case 'kolom':
            return ubahKolom(ubahOpsi(opsi, 'pk'));
    }
}

module.exports = { cetakTabel, validasi, ubahOpsi, ubahKolom, daftar, hapus, cari, update, tambah }