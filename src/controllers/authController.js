import bcrypt from "bcryptjs";
import prisma from "../models/prismaClient.js";
import generateToken from "../utils/generateToken.js";

// Allowed roles must match Prisma enum exactly
const ALLOWED_ROLES = ["ADMIN", "DOCTOR", "RECEPTION", "LAB"];

/**
 * Register user
 * body: { name, email, password, role }
 * Only ADMIN should create other staff in production; for assessment we allow open register (or seed admin)
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate all fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "name, email, password, role required" });
    }

    // Validate role
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}` });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
    });

    // Generate token
    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({
      message: "User created",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Login user
 * body: { email, password }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) return res.status(400).json({ message: "email & password required" });

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      message: "Login success",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
