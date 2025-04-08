import { Router } from "express";
import dotenv from "dotenv";
import { registerUser, logInUser } from "../models/user.ts";
import { regUser, logUser } from "../controllers/authControllers.js";

dotenv.config();
const router = Router();

// Register User
router.post('/register', registerUser, regUser);

// Login User
router.post("/login", logInUser, logUser);
export default router;