import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";


// import prisma from "./src";

import authRoutes from "./src/routes/authRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import labRoutes from "./src/routes/labRoutes.js";
import billRoutes from "./src/routes/billRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/bills", billRoutes);

app.get("/", (req, res) => res.send("🏥 HMS Backend running"));

// Global error example (optional)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Unhandled server error", error: err.message });
});

export default app;