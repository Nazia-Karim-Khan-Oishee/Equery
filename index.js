const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require("./config/passport")(passport);
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const cors = require("cors"); //Cross-origin resource sharing (CORS) is a browser mechanism which
//  enables controlled access to resources located outside of a given domain.
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
  })
);

// const routes = require("./routes/auth.routes");

// app.use(routes);
const authroutes = require("./routes/auth.route");
const profileroutes = require("./routes/profile.route");
const resourceroutes = require("./routes/resource.route");
const questionroutes = require("./routes/questions.route");
const commentroutes = require("./routes/comment.route");

app.use(authroutes);
app.use(profileroutes);
app.use(resourceroutes);
app.use(questionroutes);
app.use(commentroutes);

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });

const port = 3000;
const ensureAuthenticated = require("./middleware/auth.middleware");
app.get("/welcome", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/views/homePage.html");
});
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
