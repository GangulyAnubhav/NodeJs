const { app } = require('@azure/functions');
const JWT = require('jsonwebtoken');
 
const JWT_SECRET ='uY5Z5pZ3vC1kE2y3G6oM1u+9R8h1xFzJ4ZJvT9YxKQw='
const SECRET_KEY = JWT_SECRET;
//const SECRET_KEY = Buffer.from(JWT_SECRET, "base64");
 
//const SECRET_KEY = process.env.JWT_SECRET;

app.http('auth', {
    methods: ['POST'],
    route: 'auth/login',
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Auth function triggered');
        const { username, password } = await request.json();
 
        if (!username || !password) {
            return {
                status: 400,
                jsonBody: { message: "Provide username and password" }
            };
        }
 
        // Create token payload and sign
        const payload = { id: "1", username };
        //Generating a JWT token  
        const token = JWT.sign(payload, SECRET_KEY,{
            expiresIn: "1h"
        });
 
        return {
            status: 200,
            jsonBody: { message: "Login successful",
            token : `Bearer ${token}`
            }
        };
    }
});
