import prisma from "../models/prismaClient.js";

/**
 * Reception: create patient
 * body: { name, age, gender, contact, doctorId? }
 */
export const createPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, doctorId } = req.body;
    if (!name || !age || !gender) return res.status(400).json({ message: "name, age, gender required" });

    const patient = await prisma.patient.create({
      data: { name, age: Number(age), gender, contact, doctorId: doctorId ? Number(doctorId) : null }
    });

    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const listPatients = async (req, res) => {
  try {
    // Basic pagination & search
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const search = req.query.search || "";

    const where = search
      ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { contact: { contains: search, mode: "insensitive" } }] }
      : {};

    const patients = await prisma.patient.findMany({
      where,
      include: { doctor: { select: { id: true, name: true, email: true } }, treatments: true, bills: true, labReports: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.patient.count({ where });

    res.json({ page, limit, total, data: patients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getPatient = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { doctor: true, treatments: true, bills: true, labReports: true }
    });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
