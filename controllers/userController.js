import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { validateUserRegistration } from '../utils/validators.js';
import { createUser } from '../services/userServices.js';

export const createUserHandler = [
  validateUserRegistration,
  asyncHandler(async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('sign-up', {
        errors: errors.array(),
        data: req.body, 
      })
    }

    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await createUser(username, email, hashedPassword);
      req.session.successMessage = "Sign-up successful! You can now log in."
      res.redirect('/login');
    } catch (err) {
      console.log('Database error:', err);

      // Handle duplicate email error (PostgreSQL error code for unique violation)
      if (err.code === '23505') {
        return res.status(400).render('sign-up', {
          errors: [{ msg: 'Email already in use' }],
          data: req.body
        });
      }

      throw err;
    }
  })
]

export const loginHandler = asyncHandler(async(req, res, next) => {
  passport.authenticate('local', async(err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).render('login', {
        errors: [{ msg: info.message }],
        data: req.body,
      })
    }

    req.logIn(user, async(err) => {
      if (err) return next(err);

      return res.redirect('/library');
    })
  })(req, res, next);
});