import express from "express";
import { createPatient, listPatients, getPatient } from "../controllers/patientController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth(["RECEPTION","ADMIN"]), createPatient);
router.get("/", auth(), listPatients); // any authenticated role
router.get("/:id", auth(), getPatient);

export default router;
