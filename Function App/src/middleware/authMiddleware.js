const JWT = require('jsonwebtoken');
const SECRET_KEY = 'uY5Z5pZ3vC1kE2y3G6oM1u+9R8h1xFzJ4ZJvT9YxKQw='

function verifyToken(request, context) {
    const authHeader = request.headers.get('authorization');
    context.log('Authorization Header:', authHeader);

    if (!authHeader) {
        return {
            status: 401,
            jsonBody: { message: 'Authorization header missing' }
        };
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = JWT.verify(token, SECRET_KEY);
        return { valid: true, decoded };
    } catch (err) {
        return {
            status: 401,
            jsonBody: { message: 'Invalid or expired token' }
        };
    }
}

module.exports = {
    verifyToken
};