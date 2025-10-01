import prisma from "../models/prismaClient.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Create bill and generate simple PDF invoice, store path in bill
 * POST /api/bills
 * body: { patientId, amount }
 */
export const createBill = async (req, res) => {
  try {
    const { patientId, amount } = req.body;
    if (!patientId || !amount) return res.status(400).json({ message: "patientId and amount required" });

    // create DB record first (pdfUrl later)
    const bill = await prisma.bill.create({
      data: { patientId: Number(patientId), amount: Number(amount) }
    });

    // generate PDF
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const pdfPath = path.join(uploadsDir, `bill-${bill.id}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    // Simple invoice layout
    doc.fontSize(20).text("Hospital Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice ID: ${bill.id}`);
    doc.text(`Patient ID: ${patientId}`);
    doc.text(`Amount: ₹${amount}`);
    doc.text(`Issued At: ${new Date(bill.issuedAt).toLocaleString()}`);
    doc.moveDown();
    doc.text("Thank you for choosing our hospital.", { align: "center" });
    doc.end();

    // update pdfUrl
    await prisma.bill.update({
      where: { id: bill.id },
      data: { pdfUrl: pdfPath }
    });

    res.status(201).json({ billId: bill.id, pdfUrl: pdfPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
