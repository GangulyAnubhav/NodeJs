const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const port = 3000;

//Get All Users.
app.use('/users', usersRouter);

//Get A Particular User.
app.use('/users/:id',usersRouter);

//Add A User
app.use('/users',usersRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});