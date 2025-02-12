CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    categories VARCHAR(50) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    image VARCHAR(255)
);

CREATE TABLE borrowings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    book_id INTEGER,
    status BOOLEAN,
    borrow_date TIMESTAMP DEFAULT NOW(),
    return_date TIMESTAMP
);
