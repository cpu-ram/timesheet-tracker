import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getEmployeeByEmail, getEmployeeById, addEmployee } from '../services/employeeService.js';

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile?.emails[0].value;
        if (!email) console.error("No email address returned by auth provider");
        const existingEmployee = await getEmployeeByEmail(email);
        if (existingEmployee != null) {
          return done(null, existingEmployee);
        }
        else if (existingEmployee === null) {
          const newEmployee = await addEmployee({
            employeeName: profile.name.familyName + profile.name.givenName,
            employeeNickname: profile.name.givenName,
            email
          });
          return done(null, newEmployee);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getEmployeeById(id);
    if (!user) {
      return done(new Error('User not found'), null);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
