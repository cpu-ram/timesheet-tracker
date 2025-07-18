import dotenv from 'dotenv';
import { getSignUpCompletionStatus } from '../services/authServices/signUpCompletionStatusService.js';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';

dotenv.config();

const successfulAuthHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if(!req.user || !req.user.id) throw new Error('Error: req.user object absent');
  	
  const signUpCompletionStatus = await getSignUpCompletionStatus(req.user.id);
  req.session.save((err)=>{
    if(!process.env.AUTH_SUCCESS_REDIRECT || !process.env.COMPLETE_SIGNUP_REDIRECT){
      throw new Error('Error: misconfigured environment');
    }

    if(err) return next(err);

    if (signUpCompletionStatus) {
      res.redirect(process.env.AUTH_SUCCESS_REDIRECT);
    } else {
      res.redirect(process.env.COMPLETE_SIGNUP_REDIRECT);
    }
  });
};

export default successfulAuthHandler;
