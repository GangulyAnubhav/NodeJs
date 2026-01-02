const jwt = require('jsonwebtoken')

const JWT_SECRET ='uY5Z5pZ3vC1kE2y3G6oM1u+9R8h1xFzJ4ZJvT9YxKQw='

const SECRET_KEY = Buffer.from(JWT_SECRET, "base64");

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Provide username and password" });
    }

    // Create token payload and sign
    const payload = { id: "1", username };
    //Generating a JWT token
    const token = jwt.sign(payload, SECRET_KEY,{
        algorithm: "HS256",
        expiresIn: "1h",
        issuer: "https://restapi.com",
        audience: "jwt-auth-api"
        }
    );

    return res.json({ 
        message: "Login successful",
        token: token
     });
}

module.exports = {
    login
}