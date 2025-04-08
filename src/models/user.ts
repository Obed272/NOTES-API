import { body, ValidationChain } from "express-validator";

export const registerUser: ValidationChain[] = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const logInUser: ValidationChain[] = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];


