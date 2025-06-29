import { Router } from 'express';
import { loginHandler } from '../controllers/userController.js';

export const loginRouter = Router();

loginRouter.get('/login', (req, res) => {
  const successMessage = req.session.successMessage;
  delete req.session.successMessage;
  res.render('login', {errors: [], data: {}, successMessage});
});
loginRouter.post('/login', loginHandler);
