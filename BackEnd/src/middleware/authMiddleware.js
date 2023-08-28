const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

// Middleware to verify JWT token
function authenticateToken(ctx, next) {
  const authHeader = ctx.headers["authorization"];
  const token = authHeader;

  if (token === null) {
    ctx.body = "UnAuthorized";
  }

  jwt.verify(token, process.env.PRIVATE_KEY, async (err, user) => {
    if (err) {
      ctx.body = "Invalid Token";
    }
    ctx.state = user;
  });
  return next();
}

module.exports = {
  authenticateToken,
};
