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

console.log()