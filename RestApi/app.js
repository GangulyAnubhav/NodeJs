const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const port = 3000;

//Without express.json(), Express receives the body as raw, unreadable bytes, and req.body will be undefined
app.use(express.json());

app.use('/users', usersRouter);

//Get A Particular User.
app.use('/users/:id',usersRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});