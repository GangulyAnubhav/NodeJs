const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    const usersFilePath = path.join(__dirname,'../data/users.json');
    const data = fs.readFileSync(usersFilePath,'utf-8')
    const users = JSON.parse(data);

    if(!users){
        res.status(501).json(`Error occured at the time of file reading`)
    }
    res.json(users)
    console.log("Users Returned")
})

router.get('/:id', (req, res) => {
    const usersFilePath = path.join(__dirname,'../data/users.json')
    const data = fs.readFileSync(usersFilePath,'utf-8')
    const users = JSON.parse(data)
    const userId = parseInt(req.params.id)

    //.find() is a JavaScript Array method that returns the first matching element based on a condition.
    const userById = users.find( u => u.id === userId)
    res.json(userById)
})

router.post('/users',(req,res) => {
    const usersFilePath = path.join(__dirname,'../data/users.json')
})



module.exports = router;