// middleware/auth.js
const jwt = require("jsonwebtoken");

// Middleware function to check JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user; // Attach the user data to the request object
    next(); // Proceed to the next middleware/route
  });
};
const checkToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log("++++++", token);

  if (!token) {
    // Respond with 401 if token is missing
    return res.status(401).json({ message: "Access token is missing" });
  }

  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = { authenticateToken, checkToken };
