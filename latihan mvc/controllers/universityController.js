import Table from "cli-table";

function cetak(rows, callback = () => { }) {
    var judul = [];
    Object.keys(rows[0]).forEach(nama_kolom => judul.push(ubahKolom(nama_kolom)));
    var table = new Table({
        head: judul
    });
    rows.forEach(baris => table.push(Object.values(baris).map(nilai => nilai != null ? nilai : '')))
    console.log(table.toString());
    console.log();
    console.log(garis);
    callback();
}

function validasi(answer, tipe, callback) {
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

function daftar(opsi, callback) {
    switch (opsi) {
        case 1: Mahasiswa.daftarMahasiswa((sql) => printTabel(sql, callback));
            break;
        case 2: Jurusan.daftarJurusan((sql) => printTabel(sql, callback));
            break;
        case 3: Dosen.daftarDosen((sql) => printTabel(sql, callback));
            break;
        case 4: Matkul.daftarMatkul((sql) => printTabel(sql, callback));
            break;
        case 5: Kontrak.daftarKontrak((sql) => printTabel(sql, callback));
            break;
    }
}

function cari(opsi, identitas, callback) {
    switch (opsi) {
        case 1:
            break;
        case 2: Jurusan.cariJurusan(identitas, callback);
            break;
        case 3: Dosen.cariDosen(identitas, callback);
            break;
        case 4: Matkul.cariMatkul(identitas, callback);
            break;
        case 5: Kontrak.cariKontrak(identitas, callback);
            break;
    }
}

function tambah(opsi, arrayData = [], callback) {
    switch (opsi) {
        case 1: Mahasiswa.cariMahasiswa(identitas, callback);
            break;
        case 2: Jurusan.cariJurusan(identitas, callback);
            break;
        case 3: Dosen.cariDosen(identitas, callback);
            break;
        case 4: Matkul.cariMatkul(identitas, callback);
            break;
        case 5: Kontrak.cariKontrak(identitas, callback);
            break;
    }
}


function hapus(opsi, identitas, callback) {
    sql = `DELETE FROM ${ubahOpsi(opsi, 'nt')} WHERE ${ubahOpsi(opsi, 'pk')} = '${identitas}'`;
    // console.log(sql);
    db.run(sql, err => {
        if (err) console.log('gagal hapus data')
        else console.log(`Data ${ubahOpsi(opsi, 'NT')} ${identitas}, telah dihapus`)
        console.log();
        console.log(garis);
        callback();
    })
}

function daftar(rows, callback) {
    Object.keys(rows[0]).forEach(key => console.log(`${ubahKolom(key)} : ${rows[0][key]}`));
    callback();
}

export default { cetak, validasi, ubahOpsi, ubahKolom, daftar }