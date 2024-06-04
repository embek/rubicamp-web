import menu from './views/menu.js';
const { login } = menu;

let garis = '';
while (garis.length < stdout.columns) garis += '=';
console.log(garis);
console.log('Welcome to Universitas Pendidikan Indonesia\nJL. Setiabudhi No. 255');
console.log(garis);
login();