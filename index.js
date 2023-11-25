const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require("./config/passport")(passport);
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: false, // we can resave the session if nothing is change
    saveUninitialized: false, //we can save empty value
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
const routes = require("./routes/auth.route");
app.use(routes);

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
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
