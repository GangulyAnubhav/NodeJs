const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const COOKIE_NAME = "jwtToken";

exports.verifyToken = (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    // Storing decoded payload inside request object
    req.user = decoded;
    next();
  });
};
