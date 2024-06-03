const readline = require('node:readline');
const { stdin, stdout } = require('node:process');
const path = require('node:path');
const Table = require('cli-table');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, 'db', 'university.db'));
const rl = readline.createInterface(
    stdin, stdout
);

function printTable(sql, callback) {
    // console.log(typeof nama_tabel, nama_tabel);
    db.all(sql, (err, rows) => {
        if (err) console.log(err, `gagal baca`)
        else {
            var judul = [];
            Object.keys(rows[0]).forEach(nama_kolom => judul.push(ubahKolom(nama_kolom)));
            // console.log(judul);
            var table = new Table({
                head: judul
            });
            rows.forEach(baris => table.push(Object.values(baris).map(nilai => nilai != null ? nilai : '')))
            console.log(table.toString());
            console.log();
            console.log(garis);
            callback();
        }
    })
}

function validasi(answer, tipe, callback) {
    switch (tipe) {
        case 'nim':
            if (answer.length != 7) {
                console.log('Format NIM salah')
                callback(false);
            } else callback(true);
            break;
        case 'tgl_lahir':
            if (answer.length != 10) {
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
                console.log('Format opsi salah')
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

function daftarData(opsi, callback) {
    switch (opsi) {
        case 1://mahasiswa
            printTable('SELECT nim,nama_mahasiswa,tgl_lahir,alamat,kode_jurusan,nama_jurusan FROM mahasiswa LEFT JOIN jurusan USING(kode_jurusan)', callback);
            break;
        case 2://jurusan
            printTable('SELECT kode_jurusan,nama_jurusan FROM jurusan', callback);
            break;
        case 3://dosen
            printTable('SELECT nip,nama_dosen FROM dosen', callback);
            break;
        case 4://matkul
            printTable('SELECT kode_matkul,nama_matkul,sks FROM matakuliah', callback);
            break;
        case 5://kontrak
            printTable(`SELECT id,nim,nama_mahasiswa,nama_matkul,nama_dosen,nilai FROM kontrak LEFT JOIN dosen USING(nip) LEFT JOIN mahasiswa USING (nim) LEFT JOIN matakuliah USING(kode_matkul)`, callback);
            break;
        case 6://daftar sebelum nambah kontrak
            printTable('SELECT nim,nama_mahasiswa,nama_matkul,nama_dosen,nilai FROM kontrak LEFT JOIN dosen USING(nip)', callback);
            break;
    }
}

function cariData(opsi, identitas, callback) {
    let batas = '', panjang = 50;
    while (panjang--) batas += '=';

    if (opsi != 5) {
        sql = `SELECT * FROM ${ubahOpsi(opsi, 'nt')} WHERE ${ubahOpsi(opsi, 'pk')} = '${identitas}'`
        db.all(sql, (err, rows) => {
            // console.log(rows);
            if (err) console.log('gagal cari data')
            else if (rows.length == 0) {
                console.log(`${ubahOpsi(opsi, 'NT')} dengan ${ubahOpsi(opsi, 'kolom')} ${identitas}, tidak terdaftar`)
            } else {
                console.log(batas);
                console.log(`Detail ${ubahOpsi(opsi, 'NT')} dengan ${ubahOpsi(opsi, 'kolom')} '${identitas}' :`);
                Object.keys(rows[0]).forEach(key => console.log(`${ubahKolom(key)} : ${rows[0][key]}`));
            }
            console.log();
            console.log(garis);
            callback();
        })
    } else {
        sql = `SELECT * FROM kontrak WHERE nim = '${identitas}'`;
        // console.log(sql);
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
                printTable(sql, callback);
            }
        })
    }
}

function tambahData(opsi, arrayData = [], callback) {
    if (opsi != 5) sql = `INSERT INTO ${ubahOpsi(opsi, 'nt')} VALUES ('${arrayData.join(`','`)}')`;
    else sql = `INSERT INTO ${ubahOpsi(opsi, 'nt')}(nim,kode_matkul,nip) VALUES ('${arrayData.join(`','`)}')`;
    // console.log(sql);
    db.run(sql, (err) => {
        if (err) {
            console.log('gagal tambah data');
            callback()
        } else if (opsi != 5) {
            console.log(`${ubahOpsi(opsi, 'NT')} telah ditambahkan ke database`);
            console.log(garis);
            callback();
        } else {
            console.log(`kontrak telah ditambahkan`);
            sql = `SELECT id,nim,nama_mahasiswa,nama_matkul,nama_dosen,nilai FROM kontrak LEFT JOIN mahasiswa USING(nim) LEFT JOIN matakuliah USING(kode_matkul) LEFT JOIN dosen USING(nip)`;
            printTable(sql, callback)
        }
    })
}

function hapusData(opsi, identitas, callback) {
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

let garis = '';
while (garis.length < stdout.columns) garis += '=';
console.log(garis);
console.log('Welcome to Universitas Pendidikan Indonesia\nJL. Setiabudhi No. 255');
console.log(garis);
login();

function login() {
    rl.question('username   : ', cekUser => {
        sql = `SELECT * FROM users WHERE username = '${cekUser}'`;
        db.all(sql, (err, rows) => {
            if (err) console.log('gagal cek data username')
            else if (rows.length == 0) {
                console.log('username tidak terdaftar')
                login();
            } else {
                rl.question('password   : ', cekPass => {
                    if (rows[0].pass == cekPass) {
                        console.log(garis);
                        // console.log(rows);
                        console.log(`welcome, ${cekUser}. Your access level is : ${rows[0].peran}`);
                        console.log(garis);
                        menu(0);
                    } else {
                        console.log('password salah');
                        login();
                    }
                })
            }
        })

    })
}

function menu(opsi1) {
    switch (opsi1) {
        case 0:
            console.log(`silahkan pilih opsi di bawah ini :`);
            console.log(`[1] Mahasiswa\n[2] Jurusan\n[3] Dosen\n[4] Matakuliah\n[5] Kontrak\n[6] Keluar`);
            console.log(garis);
            rl.question(`Masukkan salah satu nomor dari opsi di atas : `, answer => {
                validasi(answer, 'opsi', (valid) => valid ? menu(parseInt(answer)) : menu(0))
            });
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            console.log(`silahkan pilih opsi di bawah ini :`);
            if (opsi1 != 5) {
                console.log(`[1] Daftar ${ubahOpsi(opsi1, 'NT')}\n[2] Cari ${ubahOpsi(opsi1, 'NT')}\n[3] Tambah ${ubahOpsi(opsi1, 'NT')}\n[4] Hapus ${ubahOpsi(opsi1, 'NT')}\n[5] Kembali`)
            } else {
                console.log(`[1] Daftar ${ubahOpsi(opsi1, 'NT')}\n[2] Cari ${ubahOpsi(opsi1, 'NT')}\n[3] Tambah ${ubahOpsi(opsi1, 'NT')}\n[4] Hapus ${ubahOpsi(opsi1, 'NT')}\n[5] Update Nilai\n[6] Kembali`)
            }
            console.log(garis);
            rl.question(`Masukkan salah satu nomor dari opsi di atas : `, answer => {
                validasi(answer, 'opsi', (valid) => {
                    if (valid) {
                        switch (opsi1) {
                            case 1: mahasiswa(parseInt(answer))
                                break;
                            case 2: jurusan(parseInt(answer))
                                break;
                            case 3: dosen(parseInt(answer))
                                break;
                            case 4: matkul(parseInt(answer))
                                break;
                            case 5: kontrak(parseInt(answer))
                                break;
                        }
                    } else menu(opsi1);
                });
            });
            break;
        case 6:
            process.exit(0);
    }
}

function mahasiswa(opsi2) {
    switch (opsi2) {
        case 1:
            console.log();
            daftarData(1, () => menu(1));
            break;
        case 2:
            rl.question(`Masukkan NIM mahasiswa: `, answer => {
                validasi(answer, 'nim', (valid) => {
                    if (valid) { cariData(1, answer, () => menu(1)) }
                    else menu(1);
                });
            });
            break;
        case 3:
            var jawaban = [];
            console.log(`Lengkapi data di bawah ini :`)
            daftarData(1, () => {
                rl.question('NIM\t: ', answer => {
                    validasi(answer, 'nim', (valid) => {
                        if (valid) {
                            jawaban.push(answer.trim());
                            rl.question('Nama\t: ', answer => {
                                jawaban.push(answer.trim());
                                rl.question('Tanggal Lahir\t: ', answer => {
                                    validasi(answer, 'tgl_lahir', (valid) => {
                                        if (valid) {
                                            jawaban.push(answer.trim());
                                            rl.question('Alamat\t: ', answer => {
                                                jawaban.push(answer.trim());
                                                daftarData(2, () => {
                                                    rl.question('Kode Jurusan\t: ', answer => {
                                                        validasi(answer, 'kode_jurusan', (valid) => {
                                                            if (valid) {
                                                                jawaban.push(answer.trim());
                                                                tambahData(1, jawaban, () => daftarData(1, () => menu(1)));
                                                            } else menu(1);
                                                        })
                                                    })
                                                });
                                            })
                                        } else menu(1);
                                    })
                                })
                            })
                        } else menu(1);
                    })
                })
            });
            break;
        case 4:
            rl.question(`Masukkan NIM mahasiswa : `, answer => {
                validasi(answer, 'nim', (valid) => {
                    if (valid) hapusData(1, answer, () => menu(1))
                    else menu(1);
                })
            });
            break;
        default:
            menu(0);
            break;
    }
}

function jurusan(opsi2) {
    switch (opsi2) {
        case 1:
            console.log();
            daftarData(2, () => menu(2));
            break;
        case 2:
            rl.question(`Masukkan Kode Jurusan : `, answer => {
                validasi(answer, 'kode_jurusan', (valid) => {
                    if (valid) cariData(2, answer, () => menu(2))
                    else menu(2);
                })
            });
            break;
        case 3:
            var jawaban = [];
            console.log(`Lengkapi data di bawah ini :`)
            daftarData(2, () => {
                rl.question('Kode Jurusan\t: ', answer => {
                    validasi(answer, 'kode_jurusan', (valid) => {
                        if (valid) {
                            jawaban.push(answer.trim());
                            rl.question('Nama Jurusan\t: ', answer => {
                                jawaban.push(answer.trim());
                                tambahData(2, jawaban, () => menu(2));
                            })
                        } else menu(2);
                    })
                })
            });
            break;
        case 4:
            rl.question(`Masukkan Kode Jurusan : `, answer => {
                validasi(answer, 'kode_jurusan', (valid) => {
                    if (valid) hapusData(2, answer, () => menu(2))
                    else menu(2);
                }
                )
            });
            break;
        default:
            menu(0);
            break;
    }
}

function dosen(opsi2) {
    switch (opsi2) {
        case 1:
            console.log();
            daftarData(3, () => menu(3));
            break;
        case 2:
            rl.question(`Masukkan NIP : `, answer => {
                validasi(answer, 'nip', (valid) => {
                    if (valid) cariData(3, answer, () => menu(3))
                    else menu(3);
                })
            });
            break;
        case 3:
            var jawaban = [];
            console.log(`Lengkapi data di bawah ini :`)
            daftarData(3, () => {
                rl.question('NIP\t: ', answer => {
                    validasi(answer, 'nip', (valid) => {
                        if (valid) {
                            jawaban.push(answer.trim());
                            rl.question('Nama Dosen\t: ', answer => {
                                jawaban.push(answer.trim());
                                tambahData(3, jawaban, () => menu(3));
                            })
                        } else menu(3);
                    })
                })
            });
            break;
        case 4:
            rl.question(`Masukkan NIP : `, answer => {
                validasi(answer, 'nip', (valid) => {
                    if (valid) hapusData(3, answer, () => menu(3))
                    else menu(3);
                })
            });
            break;
        default:
            menu(0);
            break;
    }
}

function matkul(opsi2) {
    switch (opsi2) {
        case 1:
            console.log();
            daftarData(4, () => menu(4));
            break;
        case 2:
            rl.question(`Masukkan Kode Matakuliah: `, answer => {
                validasi(answer, 'kode_matkul', (valid) => {
                    if (valid) cariData(4, answer, () => menu(4))
                    else menu(4);
                })
            });
            break;
        case 3:
            var jawaban = [];
            console.log(`Lengkapi data di bawah ini :`)
            daftarData(4, () => {
                rl.question('Kode Matakuliah\t: ', answer => {
                    validasi(answer, 'kode_matkul', (valid) => {
                        if (valid) {
                            jawaban.push(answer.trim());
                            rl.question('Nama Matakuliah\t: ', answer => {
                                jawaban.push(answer.trim());
                                rl.question('SKS\t: ', answer => {
                                    validasi(answer, 'sks', (valid) => {
                                        if (valid) {
                                            jawaban.push(answer.trim());
                                            tambahData(4, jawaban, () => menu(4));
                                        } else menu(4);
                                    })
                                })
                            })
                        } else menu(4);
                    })
                })
            });
            break;
        case 4:
            rl.question(`Masukkan Kode Matakuliah : `, answer => {
                validasi(answer, 'kode_matkul', (valid) => {
                    if (valid) hapusData(4, answer, () => menu(4))
                    else menu(4);
                })
            });
            break;
        default:
            menu(0);
            break;
    }
}

function kontrak(opsi2) {
    switch (opsi2) {
        case 1:
            console.log();
            daftarData(5, () => menu(5));
            break;
        case 2:
            daftarData(1, () => {
                rl.question(`Masukkan NIM mahasiswa: `, answer => {
                    validasi(answer, 'nim', (valid) => {
                        if (valid) cariData(5, answer, () => menu(5))
                        else menu(5);
                    })
                })
            })
            break;
        case 3:
            var jawaban = [];
            console.log(`Lengkapi data di bawah ini :`)
            daftarData(1, () => {
                rl.question('Masukkan NIM\t: ', answer => {
                    validasi(answer, 'nim', (valid) => {
                        if (valid) {
                            jawaban.push(answer.trim());
                            daftarData(4, () => {
                                rl.question('Masukkan Kode Matakuliah\t: ', answer => {
                                    validasi(answer, 'kode_matkul', (valid) => {
                                        if (valid) {
                                            jawaban.push(answer.trim());
                                            daftarData(3, () => {
                                                rl.question('Masukkan NIP Dosen\t: ', answer => {
                                                    validasi(answer, 'nip', (valid) => {
                                                        if (valid) {
                                                            jawaban.push(answer.trim());
                                                            tambahData(5, jawaban, () => menu(5));
                                                        } else menu(5);
                                                    })
                                                })
                                            })
                                        } else menu(5);
                                    })
                                })
                            })
                        } else menu(5);
                    })
                })
            });
            break;
        case 4:
            rl.question(`Masukkan ID kontrak : `, answer => hapusData(5, answer, () => menu(5)));
            break;
        case 5:
            var jawaban = [];
            daftarData(5, () => {
                rl.question(`Masukkan NIM mahasiswa :`, answer => {
                    validasi(answer, 'nim', (valid) => {
                        if (valid) {
                            jawaban.push(answer.trim());
                            console.log(`Detail mahasiswa dengan NIM '${answer}' :`)
                            sql = `SELECT id,nama_matkul,nilai FROM kontrak LEFT JOIN matakuliah USING(kode_matkul) WHERE nim='${answer}'`;
                            printTable(sql, () => {
                                rl.question(`Masukkan id yang akan diubah nilainya :`, answer => {
                                    jawaban.push(answer.trim());
                                    rl.question(`tulis nilai yang baru :`, answer => {
                                        validasi(answer, 'nilai', (valid) => {
                                            if (valid) {
                                                sql = `UPDATE kontrak SET nilai='${answer.trim()}' WHERE id='${jawaban[1]}'`;
                                                db.run(sql, (err) => {
                                                    if (err) console.log('gagal update nilai')
                                                    else {
                                                        console.log(`nilai telah diupdate`);
                                                        daftarData(5, () => menu(5));
                                                    }
                                                })
                                            } else menu(5);
                                        })
                                    })
                                })
                            })
                        } else menu(5);
                    })
                })
            })
            break;
        default:
            menu(0);
            break;
    }
}

