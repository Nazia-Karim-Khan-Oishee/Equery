const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        498654388309 -
        udglmh584jgfdad2qdbmh2oj0ujo3o59.apps.googleusercontent.com,
      clientSecret: GOCSPX - aLA4hMSioExyA_DR20G7MhkDuPu5,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // The user has been authenticated
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
