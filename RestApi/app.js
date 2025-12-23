const express = require('express');
const app = express();
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');

//const PORT = 3000;

// Azure provides the PORT dynamically
const PORT = process.env.PORT || 3000;

//Without express.json(), Express receives the body as raw, unreadable bytes, and req.body will be undefined
app.use(express.json());

app.use('/', authRouter);
app.use('/', userRouter);

// Health check route (VERY useful on Azure)
app.get('/', (req, res) => {
  res.send('Node.js API running on Azure and connected with APIM........... 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});