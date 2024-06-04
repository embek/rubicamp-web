import Users from '../models/Users.js';
import { stdin, stdout, exit } from 'node:process';
import { createInterface } from 'node:readline';
import universityController from `../controllers/universityController`;
const { validasi, daftar } = universityController;
const rl = createInterface(
    stdin, stdout
);

function login(username = null) {
    switch (arguments.length) {
        case 0:
            rl.question('username   : ', answer => Users.cek(answer, (err, exist = false) => {
                if (err) console.log('gagal cek data username')
                else if (!exist) {
                    console.log('username tidak terdaftar');
                    login();
                } else {
                    login(username);
                }
            }))
            break;
        case 1:
            rl.question('password   : ', answer => Users.cek(answer, username, (err, valid = false, peran = null) => {
                if (err) console.log('gagal cek data password')
                else if (!valid) {
                    console.log('password salah');
                    login(username);
                } else {
                    console.log(`welcome, ${username}. Your access level is : ${peran}`);
                    menu();
                }
            }))
            break;
    }
}

function menu(opsi1 = null, opsi2 = null) {
    switch (arguments.length) {
        case 0:
            console.log(`silahkan pilih opsi di bawah ini :`);
            console.log(`[1] Mahasiswa\n[2] Jurusan\n[3] Dosen\n[4] Matakuliah\n[5] Kontrak\n[6] Keluar`)
            console.log(garis);
            rl.question(`Masukkan salah satu nomor dari opsi di atas : `, answer => {
                validasi(answer, 'opsi', (valid) => valid ? menu(parseInt(answer)) : menu())
            });
            break;
        case 1:
            console.log(`silahkan pilih opsi di bawah ini :`);
            if (opsi1 == 6) exit(0);
            else if (opsi1 != 5) {
                console.log(`[1] Daftar ${ubahOpsi(opsi1, 'NT')}\n[2] Cari ${ubahOpsi(opsi1, 'NT')}\n[3] Tambah ${ubahOpsi(opsi1, 'NT')}\n[4] Hapus ${ubahOpsi(opsi1, 'NT')}\n[5] Kembali`)
            } else {
                console.log(`[1] Daftar ${ubahOpsi(opsi1, 'NT')}\n[2] Cari ${ubahOpsi(opsi1, 'NT')}\n[3] Tambah ${ubahOpsi(opsi1, 'NT')}\n[4] Hapus ${ubahOpsi(opsi1, 'NT')}\n[5] Update Nilai\n[6] Kembali`)
            }
            rl.question(`Masukkan salah satu nomor dari opsi di atas : `, answer => {
                validasi(answer, 'opsi', (valid) => {
                    if (valid) menu(opsi1, answer)
                    else menu(opsi1);
                });
            });
            break
        case 2:
            switch (opsi2) {
                case 1: mahasiswa(opsi2)
                    break;
                case 2: jurusan(opsi2)
                    break;
                case 3: dosen(opsi2)
                    break;
                case 4: matkul(opsi2)
                    break;
                case 5: kontrak(opsi2)
                    break;
            }
            break


    }
}

function mahasiswa(opsi2, arrayData = []) {
    let jawaban = arrayData;
    switch (opsi2) {
        case '1':
            console.log();
            daftar(1, () => menu(1))
            break;
        case '2':
            rl.question(`Masukkan NIM mahasiswa: `, answer => {
                validasi(answer, 'nim', (valid) => {
                    if (valid) { cari(1, answer, () => menu(1)) }
                    else mahasiswa(opsi2);
                });
            });
            break;
        case '3':
            console.log(`Lengkapi data di bawah ini :`)
            daftar(1, () => {
                rl.question('NIM\t: ', answer => {
                    validasi(answer, 'nim', (valid) => {
                        if (valid) {
                            jawaban.push(answer.trim());
                            rl.question('Nama\t: ', answer => {
                                jawaban.push(answer.trim());
                                mahasiswa('31', jawaban)
                            })
                        } else mahasiswa(opsi2);
                    })
                })
            });
            break;
        case '31':
            rl.question('Tanggal Lahir\t: ', answer => {
                validasi(answer, 'tgl_lahir', (valid) => {
                    if (valid) {
                        jawaban.push(answer.trim());
                        rl.question('Alamat\t: ', answer => {
                            jawaban.push(answer.trim());
                            daftar(2, () => {
                                mahasiswa('32', jawaban);
                            });
                        })
                    } else mahasiswa('31', jawaban);
                })
            })
            break;
        case '32':
            rl.question('Kode Jurusan\t: ', answer => {
                validasi(answer, 'kode_jurusan', (valid) => {
                    if (valid) {
                        jawaban.push(answer.trim());
                        tambah(1, jawaban, () => daftar(1, () => menu(1)));
                    } else mahasiswa(32);
                })
            })
            break;
        case '4':
            rl.question(`Masukkan NIM mahasiswa : `, answer => {
                validasi(answer, 'nim', (valid) => {
                    if (valid) hapusData(1, answer, () => menu(1))
                    else mahasiswa(opsi2);
                })
            });
            break;
        default:
            menu();
            break;
    }
}

function jurusan(opsi2, arrayData = []) {
    let jawaban = arrayData;
    switch (opsi2) {
        case '1':
            console.log();
            daftar(2, () => menu(2));
            break;
        case '2':
            rl.question(`Masukkan Kode Jurusan : `, answer => {
                validasi(answer, 'kode_jurusan', (valid) => {
                    if (valid) cari(2, answer, () => menu(2))
                    else jurusan(2);
                })
            });
            break;
        case '3':
            console.log(`Lengkapi data di bawah ini :`)
            daftarData(2, () => {
                jurusan('31')
            });
            break;
        case '31':
            rl.question('Kode Jurusan\t: ', answer => {
                validasi(answer, 'kode_jurusan', (valid) => {
                    if (valid) {
                        jawaban.push(answer.trim());
                        rl.question('Nama Jurusan\t: ', answer => {
                            jawaban.push(answer.trim());
                            tambah(2, jawaban, () => menu(2));
                        })
                    } else jurusan('31');
                })
            })
            break;
        case '4':
            rl.question(`Masukkan Kode Jurusan : `, answer => {
                validasi(answer, 'kode_jurusan', (valid) => {
                    if (valid) hapus(2, answer, () => menu(2))
                    else jurusan(4);
                }
                )
            });
            break;
        default:
            menu();
            break;
    }
}

function dosen(opsi2, arrayData = []) {
    let jawaban = arrayData;
    switch (opsi2) {
        case '1':
            console.log();
            daftar(3, () => menu(3));
            break;
        case '2':
            rl.question(`Masukkan NIP : `, answer => {
                validasi(answer, 'nip', (valid) => {
                    if (valid) cari(3, answer, () => menu(3))
                    else dosen('2');
                })
            });
            break;
        case '3':
            console.log(`Lengkapi data di bawah ini :`)
            daftar(3, () => {
                dosen('31');
            });
            break;
        case '31':
            rl.question('NIP\t: ', answer => {
                validasi(answer, 'nip', (valid) => {
                    if (valid) {
                        jawaban.push(answer.trim());
                        rl.question('Nama Dosen\t: ', answer => {
                            jawaban.push(answer.trim());
                            tambah(3, jawaban, () => menu(3));
                        })
                    } else dosen('31');
                })
            })
            break;
        case '4':
            rl.question(`Masukkan NIP : `, answer => {
                validasi(answer, 'nip', (valid) => {
                    if (valid) hapus(3, answer, () => menu(3))
                    else dosen('4');
                })
            });
            break;
        default:
            menu(0);
            break;
    }
}

function matkul(opsi2, arrayData = []) {
    let jawaban = arrayData;
    switch (opsi2) {
        case '1':
            console.log();
            daftar(4, () => menu(4));
            break;
        case '2':
            rl.question(`Masukkan Kode Matakuliah: `, answer => {
                validasi(answer, 'kode_matkul', (valid) => {
                    if (valid) cari(4, answer, () => menu(4))
                    else matkul('2');
                })
            });
            break;
        case '3':
            console.log(`Lengkapi data di bawah ini :`)
            daftar(4, () => {
                matkul('31');
            });
            break;
        case '31':
            rl.question('Kode Matakuliah\t: ', answer => {
                validasi(answer, 'kode_matkul', (valid) => {
                    if (valid) {
                        jawaban.push(answer.trim());
                        rl.question('Nama Matakuliah\t: ', answer => {
                            jawaban.push(answer.trim());
                            matkul('32', jawaban);
                        })
                    } else matkul('31');
                })
            })
            break;
        case '32':
            rl.question('SKS\t: ', answer => {
                validasi(answer, 'sks', (valid) => {
                    if (valid) {
                        jawaban.push(answer.trim());
                        tambah(4, jawaban, () => menu(4));
                    } else matkul('32', jawaban);
                })
            })
            break;
        case '4':
            rl.question(`Masukkan Kode Matakuliah : `, answer => {
                validasi(answer, 'kode_matkul', (valid) => {
                    if (valid) hapus(4, answer, () => menu(4))
                    else matkul('4');
                })
            });
            break;
        default:
            menu();
            break;
    }
}


function kontrak(opsi2, arrayData = []) {
    let lanjut = false;
    let jawaban = arrayData;
    switch (opsi2) {
        case '1':
            console.log();
            daftar(5, () => menu(5));
            break;
        case '2':
            daftar(1, () => {
                kontrak('21');
            })
            break;
        case '21':
            rl.question(`Masukkan NIM mahasiswa: `, answer => {
                validasi(answer, 'nim', (valid) => {
                    if (valid) cari(5, answer, () => menu(5))
                    else kontrak('21');
                })
            })
            break;
        case '3':
            console.log(`Lengkapi data di bawah ini :`)
            daftarData(1, () => {
                kontrak('31');
            });
            break;
        case '31':
            rl.question('Masukkan NIM\t: ', answer => {
                validasi(answer, 'nim', (valid) => {
                    if (valid) {
                        jawaban.push(answer.trim());
                        daftarData(4, () => {
                            kontrak('32', jawaban);
                        })
                    } else kontrak('31');
                })
            })
            break;
        case '32':
            rl.question('Masukkan Kode Matakuliah\t: ', answer => {
                validasi(answer, 'kode_matkul', (valid) => {
                    if (valid) {
                        jawaban.push(answer.trim());
                        daftarData(3, () => {
                            kontrak('33', jawaban);
                        })
                    } else kontrak('32', jawaban);
                })
            })
            break;
        case '33':
            rl.question('Masukkan NIP Dosen\t: ', answer => {
                validasi(answer, 'nip', (valid) => {
                    if (valid) {
                        jawaban.push(answer.trim());
                        tambahData(5, jawaban, () => menu(5));
                    } else kontrak('33', jawaban);
                })
            })
            break;
        case '4':
            rl.question(`Masukkan ID kontrak : `, answer => hapus(5, answer, () => menu(5)));
            break;
        case '5':
            daftar(5, () => {
                while (!lanjut) {
                    rl.question(`Masukkan NIM mahasiswa :`, answer => {
                        validasi(answer, 'nim', (valid) => {
                            lanjut = valid;
                            if (valid) {
                                console.log(`Detail mahasiswa dengan NIM '${answer}' :`)
                                daftar(6, answer, () => {
                                    rl.question(`Masukkan id yang akan diubah nilainya :`, id => {
                                        lanjut = false;
                                        while (!lanjut) {
                                            rl.question(`tulis nilai yang baru :`, nilai => {
                                                validasi(nilai, 'nilai', (valid) => {
                                                    lanjut = valid;
                                                    if (valid) {
                                                        update(id, nilai, (err) => {
                                                            if (err) console.log('gagal update nilai')
                                                            else {
                                                                console.log(`nilai telah diupdate`);
                                                                daftar(5, () => menu(5));
                                                            }
                                                        })
                                                    }
                                                })
                                            })
                                        }
                                    })
                                })
                            }
                        })
                    })
                }
            })
            break;
        default:
            menu();
            break;
    }
}

export default { login };