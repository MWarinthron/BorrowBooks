import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


router.post("/:book_id", authMiddleware, async (req, res) => {
  try {
    const { borrow_date, return_date } = req.body;
    const book = await pool.query("SELECT * FROM books WHERE id = $1", [req.params.book_id]);
    if (book.rows.length === 0) return res.status(404).json({ message: "ไม่พบหนังสือ" });

    await pool.query(
      "INSERT INTO borrowings (user_id, book_id, borrow_date, return_date, status) VALUES ($1, $2, $3, $4, false)",
      [req.user.id, req.params.book_id, borrow_date, return_date]
    );

    await pool.query("UPDATE books SET available = false WHERE id = $1", [req.params.book_id]);

    res.json({ message: "ยืมหนังสือสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/return/:book_id", authMiddleware, async (req, res) => {
  try {
    const borrow = await pool.query(
      "SELECT * FROM borrowings WHERE user_id = $1 AND book_id = $2 AND status = false",
      [req.user.id, req.params.book_id]
    );
    if (borrow.rows.length === 0) return res.status(404).json({ message: "ไม่มีประวัติการยืม" });

    await pool.query(
      "UPDATE borrowings SET status = true WHERE user_id = $1 AND book_id = $2 AND status = false",
      [req.user.id, req.params.book_id]
    );

    await pool.query("UPDATE books SET available = true WHERE id = $1", [req.params.book_id]);

    res.json({ message: "คืนหนังสือสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/book/:book_id", authMiddleware, async (req, res) => {
  try {
    const { book_id } = req.params;

 
    const book = await pool.query("SELECT * FROM books WHERE id = $1", [book_id]);
    if (book.rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบหนังสือที่ต้องการลบ" });
    }

    
    const borrowCheck = await pool.query(
      "SELECT * FROM borrowings WHERE book_id = $1 AND status = false",
      [book_id]
    );
    if (borrowCheck.rows.length > 0) {
      return res.status(400).json({ message: "ไม่สามารถลบหนังสือที่กำลังถูกยืมได้" });
    }

   
    await pool.query("DELETE FROM books WHERE id = $1", [book_id]);

    res.json({ message: "ลบหนังสือสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
