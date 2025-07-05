import { Router } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import handleSuccessfulAuth from '../controllers/authController.js';
import { getSignUpCompletionStatus } from '../services/authServices/signUpCompletionStatusService.js';

dotenv.config();

const authRouter = Router();

authRouter.get('/status', async (req, res) => {
  const signUpCompletionStatus = req.user ?
    await getSignUpCompletionStatus(req.user.id) : null;

  if (req.isAuthenticated()) {
    return res.json({ authStatus: true, signUpCompletionStatus });
  }
  return res.json({ authStatus: false, signUpComplete: signUpCompletionStatus });
})

authRouter.get('/username', (req, res) => {
  if (req.isAuthenticated) {
    const username = req.user.name;
    res.status(200).json({ username });
  }
  else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
});

authRouter.post('/logout', (req, res) => {
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
  (req, res) => {
    handleSuccessfulAuth(req, res);
  }
);

authRouter.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  })
})


export default authRouter;
