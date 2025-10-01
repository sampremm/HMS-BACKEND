import bcrypt from "bcryptjs";
import prisma from "../src/models/prismaClient.js"; // make sure path is correct

const seedUsers = async () => {
  try {
    const users = [
      { name: "Admin User", email: "admin@example.com", password: "admin123", role: "ADMIN" },
      { name: "Doctor User", email: "doctor@example.com", password: "doctor123", role: "DOCTOR" },
      { name: "Reception User", email: "reception@example.com", password: "reception123", role: "RECEPTION" },
      { name: "Lab User", email: "lab@example.com", password: "lab123", role: "LAB" },
    ];

    for (const u of users) {
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      if (!existing) {
        const hashed = await bcrypt.hash(u.password, 10);
        await prisma.user.create({
          data: {
            name: u.name,
            email: u.email,
            password: hashed,
            role: u.role,
          },
        });
        console.log(`✅ User created: ${u.email}`);
      } else {
        console.log(`ℹ️ User already exists: ${u.email}`);
      }
    }

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedUsers();
