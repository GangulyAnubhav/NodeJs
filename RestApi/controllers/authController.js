const jwt = require('jsonwebtoken')
const db = require('../config/db')

const SECRET_KEY = 'Anubhav@123'
const COOKIE_NAME = 'jwtToken'

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Provide username and password" });
    }

    // Checking credential details
    if (username !== user.username || password !== user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token payload and sign
      const payload = { id: "1", username: user.username };
      //Generating a JWT token
      const token = jwt.sign(payload, SECRET_KEY);
    
      // Set cookie (httpOnly so JS can't access it), sameSite Lax for typical flows
      res.cookie(COOKIE_NAME, token, {
        maxAge: 60000
      });
    
      return res.json({ message: "Login successful" });
}

module.exports = {
    login
}