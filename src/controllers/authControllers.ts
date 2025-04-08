import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma/prisma.ts"
import {  Request, Response } from "express"
import { validationResult } from "express-validator";



interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// Register user
export const regUser = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(400).json({ error: "User already exists" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: {name, email, password: hashedPassword,}});

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    console.log("JWT_SECRET", process.env.JWT_SECRET);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
export const logUser = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
