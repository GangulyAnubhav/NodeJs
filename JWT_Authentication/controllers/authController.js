const jwt = require("jsonwebtoken");
const users = require('../data/users.json')

// simple example user (replace with DB lookup later)
const user = {
  id: 1,
  username: "Anubhav",
  password: "12345" // in production store hashed password and use bcrypt.compare
};

const SECRET_KEY = process.env.SECRET_KEY;
const COOKIE_NAME = "jwtToken";

exports.login = (req, res) => {
  const { username, password } = req.body;
  
  // Checking is username or password in blank or not.
  if (!username || !password) {
    return res.status(400).json({ message: "Provide username and password" });
  }

  // Checking credential details
  if (username !== user.username || password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create token payload and sign
  const payload = { id: user.id, username: user.username };
  //Generating a JWT token
  const token = jwt.sign(payload, SECRET_KEY);

  // Set cookie (httpOnly so JS can't access it), sameSite Lax for typical flows
  res.cookie(COOKIE_NAME, token, {
    maxAge: 60000
  });

  return res.json({ message: "Login successful" });
};

exports.getUsers = (req, res) => {
  res.json({ 
        message: "Users fetched",
        requester: req.user, 
        users 
    });
};

exports.logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: "Logged out" });
};
