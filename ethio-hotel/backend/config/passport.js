const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) { done(err, null); }
  });

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: 'google',
            providerId: profile.id,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined
          });
        }
        done(null, user);
      } catch (err) { done(err, null); }
    }));
    console.log('Google OAuth enabled');
  } else {
    console.log('Google OAuth disabled (no keys in .env)');
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'photos']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : profile.id + '@facebook.local';
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            provider: 'facebook',
            providerId: profile.id,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined
          });
        }
        done(null, user);
      } catch (err) { done(err, null); }
    }));
    console.log('Facebook OAuth enabled');
  } else {
    console.log('Facebook OAuth disabled (no keys in .env)');
  }
};