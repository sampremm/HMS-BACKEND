import express from "express";
import { createBill } from "../controllers/billController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth(["ADMIN","RECEPTION"]), createBill);

export default router;
