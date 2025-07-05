import dotenv from 'dotenv';
import { getSignUpCompletionStatus } from '../services/authServices/signUpCompletionStatusService';

dotenv.config();

const successfulAuthHandler = async (req, res, next) => {
  const signUpCompletionStatus = await getSignUpCompletionStatus(req.user.id);
  req.session.save((err)=>{
    if(err) return next(err);  
    if (signUpCompletionStatus) {
      res.redirect(process.env.AUTH_SUCCESS_REDIRECT);
    } else {
      res.redirect(process.env.COMPLETE_SIGNUP_REDIRECT);
    }
  });
};

export default successfulAuthHandler;
