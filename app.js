import express from 'express';
import path from 'path';
import expressSession from 'express-session';
import pgSession from 'connect-pg-simple';
import passport from 'passport';
import dotenv from 'dotenv';
import prisma from './lib/prisma.js';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { fileURLToPath } from 'url';
import { indexRouter } from './routers/indexRouter.js';
import { loginRouter } from './routers/loginRouter.js';
import { signUpRouter } from './routers/signupRouter.js';
import { libraryRouter } from './routers/libraryRouter.js';
import './config/passport.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// PostgreSQL + Prisma
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

// Passport
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', signUpRouter);
app.use('/', libraryRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.log(err);

  if (res.headersSent) {
    return next(err); // delegate to default Express error handler
  }

  res.status(err.statusCode || 500).send(err.message);
});