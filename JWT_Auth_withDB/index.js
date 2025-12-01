require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/authRoutes')
const userRoute = require('./routes/userRoutes')
const port = process.env.PORT
const app =express()

app.use(express.json())
app.use(cookieParser())

app.use('/',authRoute)
app.use('/',userRoute)

app.listen(port, () =>{
    console.log(`Server running at http://localhost:${port}`)
})