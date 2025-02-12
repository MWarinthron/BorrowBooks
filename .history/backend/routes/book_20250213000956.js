import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const books = await pool.query("SELECT * FROM books where available = true");
    res.json(books.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/borrowed", async (req, res) => {
  try {
    const books = await pool.query("SELECT * FROM books where available = false");
    res.json(books.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:book_id", async (req, res) => {
  try {
    const books = await pool.query("SELECT * FROM books where id = $1", [req.params.book_id]);
    res.json(books.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  const { title, author, image,  categories} = req.body;
  try {
    const newBook = await pool.query(
      "INSERT INTO books (title, author, image, categories, available) VALUES ($1, $2, $3, $4, true) RETURNING *",
      [title, author, image, categories]
    );
    res.json(newBook.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("UPDATE books SET available = false WHERE id = $1", [req.params.id]);
    res.json({ message: "ลบหนังสือสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
