import dotenv from 'dotenv';
import { getSignUpCompletionStatus } from '../services/authServices/signUpCompletionStatusService';

dotenv.config();

const successfulAuthHandler = async (req, res) => {
  const signUpCompletionStatus = await getSignUpCompletionStatus(req.user.id);
  if (signUpCompletionStatus) {
    res.redirect(process.env.AUTH_SUCCESS_REDIRECT);
  } else {
    res.redirect(process.env.COMPLETE_SIGNUP_REDIRECT);
  }
}

export default successfulAuthHandler;