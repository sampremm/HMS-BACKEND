import express from "express";
import { addTreatment, myPatients } from "../controllers/doctorController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:patientId/treatments", auth(["DOCTOR"]), addTreatment);
router.get("/my-patients", auth(["DOCTOR","ADMIN"]), myPatients);

export default router;
