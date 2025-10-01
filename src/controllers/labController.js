import prisma from "../models/prismaClient.js";

/**
 * Upload lab report (multer must save file and provide req.file)
 * POST /api/labs
 * form-data: file, patientId
 */
export const uploadLabReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File required" });
    const patientId = Number(req.body.patientId);
    if (!patientId) return res.status(400).json({ message: "patientId required" });

    const labStaffId = req.user.id;

    const report = await prisma.labReport.create({
      data: {
        fileUrl: req.file.path,
        patientId,
        labStaffId
      }
    });

    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
