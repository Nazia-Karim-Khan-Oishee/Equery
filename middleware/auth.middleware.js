const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(" Req Authenticated: " + req.user.id);

    next();
  } else {
    console.log(" Request Not Authenticated            ");

    res.status(400).json({ error: "You do not have access" });
  }
};
module.exports = ensureAuthenticated;
