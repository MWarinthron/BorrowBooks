import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO userss (name, email, password, role) VALUES ($1, $2, $3, 'user') RETURNING id, email",
      [name, email, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM userss WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await pool.query("SELECT id, email, name, role FROM userss WHERE id = $1", [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my-bookss", authMiddleware, async (req, res) => {
  try {
    const borrowedbookss = await pool.query(
      "SELECT b.id, b.title, b.author, b.image, br.borrow_date, br.return_date FROM bookss b INNER JOIN borrowings br ON b.id = br.book_id WHERE br.user_id = $1 AND br.status = false",
      [req.user.id]
    );
    res.json(borrowedbookss.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
