import express from "express";
import multer from "multer";
import { uploadLabReport } from "../controllers/labController.js";
import auth from "../middleware/authMiddleware.js";
import path from "path";

// Multer setup: stores to 'uploads/' with original filename + timestamp
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "uploads")),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${ts}-${safe}`);
  }
});
const upload = multer({ storage });

const router = express.Router();

router.post("/", auth(["LAB"]), upload.single("file"), uploadLabReport);

export default router;
