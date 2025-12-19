const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
//const PORT = 3000;

// Azure provides the PORT dynamically
const PORT = process.env.PORT || 3000;

//Without express.json(), Express receives the body as raw, unreadable bytes, and req.body will be undefined
app.use(express.json());

app.use('/users', usersRouter);

// Health check route (VERY useful on Azure)
app.get('/', (req, res) => {
  res.send('Node.js API running on Azure 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});