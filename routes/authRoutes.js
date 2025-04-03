import express from "express";
import dotenv from "dotenv";
import { registerUser, logInUser } from "../models/users.js";
import { regUser, logUser } from "../controllers/authControllers.js";

dotenv.config();
const router = express.Router();

// Register User
router.post('/register', registerUser, regUser);

// Login User
router.post("/login", logInUser, logUser);
export default router;