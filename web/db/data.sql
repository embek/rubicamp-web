CREATE TABLE
    biodata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        height integer,
        weight float,
        birthdate date,
        married boolean default false
    );