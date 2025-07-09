import { body } from 'express-validator';
import { findUserByEmail } from "../services/userServices.js";

export const validateUserRegistration = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .matches(/^(?=.*[A-Za-z])[A-Za-z0-9]+$/)
    .withMessage('Username must contain only letters and numbers, and include at least one letter')
    .isLength({ max: 50 }).withMessage('Username must be 50 characters or fewer'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail()
    .custom(async (email) => {
      const exists = await findUserByEmail(email);
      if (exists) {
        throw new Error('Email already in use');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 30 }).withMessage('Password must be between 6 and 30 characters')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
  }),
];