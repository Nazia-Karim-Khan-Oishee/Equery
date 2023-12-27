const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const User = require("../datamodels/User.model");

const GOOGLE_CLIENT_ID =
  "498654388309-udglmh584jgfdad2qdbmh2oj0ujo3o59.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

function initialize(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "https://oauth.pstmn.io/v1/vscode-callback",
        passReqToCallback: true,
        scope: ["email", "profile"],
      },
      async function (request, accessToken, refreshToken, profile, done) {
        try {
          const user = await User.findOne({ googleId: profile.id });

          if (user) {
            console.log("here");
            // User already exists, return the user
            return done(null, user);
          }

          // User doesn't exist, create a new user
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            // Add other fields as needed
          });

          await newUser.save();

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      console.log(user);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = initialize;
