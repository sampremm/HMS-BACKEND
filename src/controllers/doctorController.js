import prisma from "../models/prismaClient.js";

/**
 * Doctor: add treatment to a patient
 * POST /api/doctors/:patientId/treatments
 * body: { description }
 */
export const addTreatment = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: "description required" });

    // optional: verify doctor assigned or doctor's id
    const treatment = await prisma.treatment.create({
      data: { description, patientId }
    });

    res.status(201).json(treatment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Doctor: get patients assigned to doctor (or all if admin)
 * GET /api/doctors/my-patients
 */
export const myPatients = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    if (!user) return res.status(401).json({ message: "User not found in request" });

    let patients;
    if (user.role === "DOCTOR") {
      patients = await prisma.patient.findMany({
        where: { doctorId: user.id },
        include: { treatments: true, labReports: true, bills: true }
      });
    } else {
      // admin can see all
      patients = await prisma.patient.findMany({ include: { doctor: true, treatments: true } });
    }

    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
