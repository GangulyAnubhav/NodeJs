const { app } = require('@azure/functions');

const fs = require('fs');
const path = require('path');

const{verifyToken} = require('../middleware/authMiddleware');

let users = [];

function readFile() {
    const usersFilePath = path.join(__dirname, '../../data/users.json');
    return fs.readFileSync(usersFilePath, 'utf-8');
}

function writeFile(users) {
    const usersFilePath = path.join(__dirname, '../../data/users.json');
    fs.writeFileSync(usersFilePath, JSON.stringify(users,null,2), 'utf-8');
}

try {
    const fileData = readFile();
    users = JSON.parse(fileData);
    console.log('Users data loaded successfully');
} catch (err) {
    console.error('Failed to load users.json:', err);
}


app.http('users', {
    methods: ['GET', 'POST', 'PATCH'],
    route: 'users/{id?}',
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Users function triggered');
        context.log('method:', request.method);

        const authResult = verifyToken(request, context);

        // If verifyToken returned an error response
        if (authResult.status) {
            return authResult;
        }

        // Attach decoded user to request
        request.user = authResult;
        context.log('Authenticated user:', request.user);

        if(request.method === 'GET') {
            const idparam = request.params.id;

            if (idparam) {
                const id = parseInt(idparam, 10);
                const user = users.find(u => u.id === id);

                if(!user) {
                    return {
                        status: 404,
                        jsonBody: { message: 'User not found' }
                    };
                };

                return {
                    status: 200,
                    jsonBody: user
                };
            }

            return {
                status: 200,
                jsonBody: users
            };
        }

        if(request.method === 'POST') {
            context.log('Creating a new user');
            const newUser = await request.json();
            if(!newUser || !newUser.email) {
                return {
                    status: 400,
                    jsonBody: { message: 'Invalid user data' }
                };
            }

            newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
            users.push(newUser);
            context.log('New user added:', newUser);
            writeFile(users);
            return {
                status: 201,
                jsonBody: {
                    message: 'User created successfully',
                    newUser
                }
            };
        }

        if (request.method === 'PATCH') {
            const idparam = request.params.id;
            if (!idparam) {
                return {
                    status: 400,
                    jsonBody: { message: 'User ID is required for update' }
                };
            }
            const id = parseInt(idparam, 10);
            const userIndex = users.findIndex(u => u.id === id);
            if (userIndex === -1) {
                return {
                    status: 404,
                    jsonBody: { message: 'User not found' }
                };
            }
            const updatedData = await request.json();
            users[userIndex] = { ...users[userIndex], ...updatedData };
            context.log('User updated:', users[userIndex]);
            //writeFile(users);
            return {
                status: 200,
                jsonBody: { message: 'User updated successfully' }
            };  
        }
    }
});
