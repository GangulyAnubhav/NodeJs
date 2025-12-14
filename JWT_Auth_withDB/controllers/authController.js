const jwt = require('jsonwebtoken')
const db = require('../config/db')

const SECRET_KEY = process.env.SECRET_KEY
const COOKIE_NAME = 'jwtToken'

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Provide username and password" });
    }

    // Check if user exists in logged_in_users table
    const sql = "SELECT * FROM logged_in_users WHERE username = ? AND password = ?";

    db.query( sql, [username, password], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (result.length === 0) {
            // User not found → insert new record
            const sql = "INSERT INTO logged_in_users (username, password) VALUES (?, ?)";
            db.query( sql, [username, password], (err2, insertResult) => {
                if (err2) return res.status(500).json({ message: "Failed to add user" });

                const newUserId = insertResult.insertId;
                const payload = { id: newUserId, username: username };

                // 3. Create JWT token
                const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2min" });

                // 4. Save token to cookie
                res.cookie(COOKIE_NAME, token, {
                    httpOnly: true,
                    maxAge: 120000
                });

                return res.json({ message: "New user added and login successful", token });
                
            });
        } else {
            // User already exists
            const user = result[0];
            const payload = { id: user.id, username: user.username };

            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2min" });

            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                maxAge: 300000
            });

            return res.json({ message: "Login successful"});
        }
    });
};



const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  db.end((err) => {
        if (err) {
            console.error("Error closing DB:", err);
            return res.status(500).json({ message: "Error closing DB connection" });
        }

        return res.json({ message: "Logged out and DB connection closed" });
    });
};

module.exports = {
    login,
    logout
}