CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100),
    role VARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL
);

CREATE TABLE IF NOT EXISTS book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    categories VARCHAR(50),
    available BOOLEAN DEFAULT TRUE,
    image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS borrowing (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    status BOOLEAN,
    borrow_date TIMESTAMP DEFAULT NOW(),
    return_date TIMESTAMP
);
