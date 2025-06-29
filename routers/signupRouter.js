import { Router } from 'express';
import { createUserHandler } from '../controllers/userController.js';

export const signUpRouter = Router();

signUpRouter.get('/sign-up', (req, res) => {
  res.render('sign-up', {errors: [], data: {}});
});
signUpRouter.post('/sign-up', createUserHandler);
