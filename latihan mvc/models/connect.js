import sqlite3 from 'sqlite3'
import { join } from 'node:path';

const db = new sqlite3.Database(join(__dirname, '..', 'db', 'university.db'));

export default { db }