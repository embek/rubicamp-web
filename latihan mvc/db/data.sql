CREATE TABLE
    jurusan (
        kode_jurusan CHARACTER(4) PRIMARY KEY NOT NULL,
        nama_jurusan VARCHAR(30) NOT NULL
    );

CREATE TABLE
    mahasiswa (
        nim CHARACTER(10) PRIMARY KEY NOT NULL,
        nama_mahasiswa VARCHAR(30) NOT NULL,
        tgl_lahir DATE,
        alamat text,
        kode_jurusan CHARACTER(4) NOT NULL,
        FOREIGN KEY (kode_jurusan) REFERENCES jurusan (kode_jurusan)
    );

CREATE TABLE
    dosen (
        nip CHARACTER(7) PRIMARY KEY NOT NULL,
        nama_dosen VARCHAR(30) NOT NULL
    );

CREATE TABLE
    matakuliah (
        kode_matkul CHARACTER(4) PRIMARY KEY NOT NULL,
        nama_matkul VARCHAR(30) NOT NULL
    );

CREATE TABLE
    daftar_pengampu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kode_matkul CHARACTER(4) NOT NULL,
        nip CHARACTER(7) NOT NULL,
        FOREIGN KEY (kode_matkul) REFERENCES matakuliah (kode_matkul),
        FOREIGN KEY (nip) REFERENCES dosen (nip)
    );

CREATE TABLE
    kontrak (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nim CHARACTER(10) NOT NULL,
        kode_matkul VARCHAR(20) NOT NULL,
        nip CHARACTER(7) NOT NULL,
        nilai VARCHAR(3) NOT NULL,
        FOREIGN KEY (kode_matkul) REFERENCES matakuliah (kode_matkul),
        FOREIGN KEY (nim) REFERENCES mahasiswa (nim),
        FOREIGN KEY (nip) REFERENCES dosen (nip)
    );

CREATE TABLE
    users (
        username VARCHAR(10) PRIMARY KEY NOT NULL,
        pass VARCHAR(10) NOT NULL
    );

INSERT INTO
    mahasiswa
VALUES
    (
        '2022070004',
        'Dimas',
        '1999-08-11',
        'Surabaya',
        'J004'
    ),
    (
        '2022070005',
        'Ikhsan',
        '2000-01-29',
        'Balikpapan',
        'J005'
    ),
    (
        '2022070006',
        'Eril',
        '2001-02-17',
        'Makasar',
        'J006'
    ),
    (
        '2022070007',
        'Zafran',
        '2001-06-01',
        'Bandung',
        'J007'
    ),
    (
        '2022070008',
        'Emir',
        '2000-10-10',
        'Cianjur',
        'J009'
    ),
    (
        '2022070009',
        'Zakka',
        '1998-12-07',
        'Lampung',
        'J010'
    ),
    (
        '2022070010',
        'Agung',
        '2002-09-13',
        'Bandung',
        'J003'
    );

INSERT INTO
    jurusan
VALUES
    ('J003', 'Elektronika'),
    ('J004', 'Mekatronika'),
    ('J005', 'Otomotif'),
    ('J006', 'Informatika'),
    ('J007', 'Alat Berat'),
    ('J008', 'Gambar Teknik'),
    ('J009', 'Arsitek'),
    ('J010', 'Gambar Bangunan');

ALTER TABLE nama_matakuliah ADD sks INTEGER NOT NULL;

SELECT
    nim,
    nama_mahasiswa,
    nama_matkul,
    dosen,
    nilai
FROM
    kontrak
    LEFT JOIN mahasiswa USING (nim)
    LEFT JOIN matakuliah USING (kode_matkul);

INSERT INTO
    dosen
VALUES
    ('D2201', 'Rubi'),
    ('D2202', 'Wildan'),
    ('D2203', 'Rizky'),
    ('D2204', 'Hilmi'),
    ('D2205', 'Bambang');

INSERT INTO
    matakuliah
VALUES
    ('MK01', 'data mining', 20),
    ('MK02', 'basic', 20),
    ('MK03', 'kerja bengkel', 20),
    ('MK04', 'matematika', 15),
    ('MK05', 'bahasa inggris', 15);

ALTER TABLE users ADD peran VARCHAR(10) NOT NULL;

INSERT INTO
    kontrak (nim, kode_matkul, nip, nilai)
VALUES
    ('2022070001', 'MK01', 'D2201', 'C'),
    ('2022070002', 'MK01', 'D2201', 'A+'),
    ('2022070003', 'MK04', 'D2204', ',B'),
    ('2022070004', 'MK02', 'D2202', 'B+'),
    ('2022070010', 'MK03', 'D2205', 'A'),
    ('2022070009', 'MK04', 'D2204', 'A++'),
    ('2022070008', 'MK01', 'D2203', 'B+'),
    ('2022070007', 'MK05', 'D2202', 'A'),
    ('2022070006', 'MK04', 'D2204', 'B+'),
    ('2022070005', 'MK01', 'D2203', 'C+'),
    ('2022070011', 'MK02', 'D2202', 'A'),
    ('2022070001', 'MK04', 'D2204', ''),
    ('2022070010', 'MK01', 'D2201', '');