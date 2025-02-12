CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    available BOOLEAN DEFAULT TRUE,
    image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS borrowings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    borrowed_at TIMESTAMP DEFAULT NOW(),
    returned_at TIMESTAMP
);
