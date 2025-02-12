import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";;

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");
    const hashedPassword = await bcrypt.hash('1234', 10);
    await pool.query(
      `
      INSERT INTO users (name, email, password, role) VALUES 
      ($1, $2, $3, $4),
      ($5, $6, $7, $8);
      `,
      [
        "Test1", "Test1@gmail.com", hashedPassword, "user",
        "Admin1", "Admin1@gmail.com", hashedPassword, "admin"
      ]
    );

    await pool.query(`
      INSERT INTO books (title, author, categories, available, image) VALUES 
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
