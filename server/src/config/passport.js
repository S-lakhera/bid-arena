import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_client_secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our db
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, pass them to the callback
          done(null, user);
        } else {
          // Check if user exists with the same email but registered locally
          const email = profile.emails[0].value;
          user = await User.findOne({ email });

          if (user) {
            // Update user to include googleId
            user.googleId = profile.id;
            if (!user.profileImage && profile.photos && profile.photos.length > 0) {
              user.profileImage = profile.photos[0].value;
            }
            await user.save();
            done(null, user);
          } else {
            // If not, create a new user in our db
            const newUser = {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              profileImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : 'default.jpg',
            };

            user = await User.create(newUser);
            done(null, user);
          }
        }
      } catch (error) {
        console.error(error);
        done(error, null);
      }
    }
  )
);

export default passport;
