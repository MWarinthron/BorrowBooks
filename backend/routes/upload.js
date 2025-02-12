import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// กำหนดโฟลเดอร์ปลายทาง (ไปที่ frontend/public/Assets/images/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../frontend/public/Assets/images");

// ตรวจสอบว่าโฟลเดอร์มีอยู่แล้วหรือยัง ถ้ายังให้สร้าง
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// กำหนด `multer` สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext; // ตั้งชื่อไฟล์เป็น timestamp
        cb(null, filename);
    },
});

const upload = multer({ storage });

// API อัปโหลดไฟล์
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({ filename: req.file.filename });
});

export default router;
