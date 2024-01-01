const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const User = require("../datamodels/User.model");
// require("dotenv").config();
require("dotenv").config({ path: "./.env" });

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
console.log(GOOGLE_CLIENT_ID);

function initialize(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL:
          // "https://oauth.pstmn.io/v1/vscode-callback",
          "http://localhost:3000/auth/google",

        // callbackURL: " http://localhost:3000/welcome",

        passReqToCallback: true,
        scope: ["email", "profile"],
      },

      async function (request, accessToken, refreshToken, profile, done) {
        try {
          const user = await User.findOne({ googleId: profile.id });
          console.log("here");

          if (user) {
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
