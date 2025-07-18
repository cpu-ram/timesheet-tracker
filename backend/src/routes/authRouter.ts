import { Router } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import handleSuccessfulAuth from '../controllers/authController.js';
import { getSignUpCompletionStatus } from '../services/authServices/signUpCompletionStatusService.js';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';
import { Response } from 'express';

dotenv.config();

const authRouter: Router = Router();

authRouter.get('/status', async (req: AuthenticatedRequest, res: Response) => {
  const signUpCompletionStatus = req.user && req.user.id ?
    await getSignUpCompletionStatus(req.user.id) : null;

  if (req.isAuthenticated()) {
    return res.json({ authStatus: true, signUpCompletionStatus });
  }
  return res.json({ authStatus: false, signUpComplete: signUpCompletionStatus });
})

authRouter.get('/username', (req: AuthenticatedRequest, res) => {
  if (req.isAuthenticated()) {
    const username = req.user.name;
    res.status(200).json({ username });
  }
  else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
});

authRouter.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
})

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}))

authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.AUTH_FAILURE_REDIRECT }),
  (req, res, next) => {
    handleSuccessfulAuth(req, res, next);
  }
);

authRouter.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  })
})


export default authRouter;
