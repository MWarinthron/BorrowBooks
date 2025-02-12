require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ใช้ .env เพื่อเก็บคีย์เชื่อมต่อ
});

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");

    // ล้างข้อมูลเก่าออกก่อน
    await pool.query("DELETE FROM borrow_records;");
    await pool.query("DELETE FROM books;");
    await pool.query("DELETE FROM users;");
    
    // เพิ่มผู้ใช้ตัวอย่าง
    await pool.query(`
      INSERT INTO users (name, email, password) VALUES 
      ('Alice', 'alice@example.com', 'hashedpassword1'),
      ('Bob', 'bob@example.com', 'hashedpassword2');
    `);

    // เพิ่มหนังสือตัวอย่าง
    await pool.query(`
      INSERT INTO books (title, author, category, available) VALUES 
      ('Clean Code', 'Robert C. Martin', 'Programming', true),
      ('The Pragmatic Programmer', 'Andy Hunt', 'Programming', true),
      ('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fantasy', true);
    `);

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    pool.end();
  }
};

seedDatabase();
