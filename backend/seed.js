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
      ('Test', 'Test@gmail.com', '1234'),
      ('Admin', 'Admin@gmail.com', '1234');
    `);

    // เพิ่มหนังสือตัวอย่าง
    await pool.query(`
      INSERT INTO books (title, author, category, available, image) VALUES 
      ('One Piece', 'Eiichiro Oda', 'manga', true, '/assets/images/OnePiece.jpg'),
      ('1984', 'George Orwell', 'recommend', true, '/assets/images/1984.jpg'),
      ('Spider-Man: The Ultimate Collection', 'Stan Lee and Steve Ditko', 'recommend', true, '/assets/images/Spider-Man.jpg');
    `);

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    pool.end();
  }
};

seedDatabase();
