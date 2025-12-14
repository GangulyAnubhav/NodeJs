require('dotenv').config()
const express = require('express')
const cookieParser =  require('cookie-parser')
const app = express()
const port = process.env.PORT
const usersRoute = require('./routes/authRoutes')

//Without express.json(), Express receives the body as raw, unreadable bytes, and req.body will be undefined
app.use(express.json())
app.use(cookieParser())

app.use('/',usersRoute)

app.listen(port,() =>{
    console.log(`Server is running on http://localhost:${port}`)
})
