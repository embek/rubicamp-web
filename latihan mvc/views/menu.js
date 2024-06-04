import Users from '../models/Users.js';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline';
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

function menu() {

}

export default { login }

