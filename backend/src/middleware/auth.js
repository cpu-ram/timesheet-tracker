import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

// Placeholder for user validation (replace with real logic)
const fakeUser = { id: 1, username: 'user', password: 'pass' };

passport.use(new LocalStrategy((username, password, done) => {
  if (username === fakeUser.username && password === fakeUser.password) {
    return done(null, fakeUser);
  }
  return done(null, false, { message: 'Incorrect credentials.' });
}));

// Serialize and deserialize user (simplified for now)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  if (id === fakeUser.id) {
    done(null, fakeUser);
  } else {
    done(new Error('User not found'));
  }
});

export default passport;
