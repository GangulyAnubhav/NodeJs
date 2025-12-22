const fs = require('fs');
const path = require('path');

const getUsers = (req, res) => {
    const usersFilePath = path.join(__dirname,'../data/users.json');
    const data = fs.readFileSync(usersFilePath,'utf-8')
    const users = JSON.parse(data);

    if(!users){
        res.status(501).json(`Error occured at the time of file reading`)
    }
    //console.log("Users Returned")
    return res.json(users)
    
}

const getUserById = (req, res) => {
    const usersFilePath = path.join(__dirname,'../data/users.json')
    const data = fs.readFileSync(usersFilePath,'utf-8')
    const users = JSON.parse(data)
    const userId = parseInt(req.params.id)

    //.find() is a JavaScript Array method that returns the first matching element based on a condition.
    const userById = users.find( u => u.id === userId)
    if (!userById) {
        return res.json({'message' : `User Not Found`})
    }
    return res.json(userById)
}

const createUser = (req,res) => {
    const usersFilePath = path.join(__dirname,'../data/users.json')
    const data = fs.readFileSync(usersFilePath,'utf-8')
    const users = JSON.parse(data)

    const newUser =  req.body
    newUser.id = users.length > 0 ? users[users.length-1].id + 1 : 1

    //Pushing new user to the array.
    users.push(newUser)
    //Writing updated array to the user file.
    fs.writeFileSync(usersFilePath, JSON.stringify(users,null,2))

    return res.status(201).json({'message' : `New User Created Successfully with Id ${newUser.id}`})
}

const updateUser = (req,res) => {
    const usersFilePath = path.join(__dirname,'../data/users.json')
    const data = fs.readFileSync(usersFilePath,'utf-8')
    const users = JSON.parse(data)
    const userId = parseInt(req.params.id)

    //Find the user index
    const userIndex = users.findIndex( u => u.id === userId)
    const newUser =  req.body
    
    //Merging two objects using spread operator and creating a new object.
    const updatedUser = {
        ...users[userIndex],
        ...newUser   
    }

    users[userIndex] = updatedUser

    fs.writeFileSync(usersFilePath,JSON.stringify(users,null,2))

    return res.status(200).json({
        'message' : "User Updated Successfully.",
        'updatedUser' : updatedUser
    })
}

const deleteUser = (req,res) => {
    const usersFilePath = path.join(__dirname,'../data/users.json')
    const data = fs.readFileSync(usersFilePath,'utf-8')
    const users = JSON.parse(data)
    const userId = parseInt(req.params.id)

    //Find the user index
    const userIndex = users.findIndex( u => u.id === userId)

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }
    
    users.splice(userIndex,1)

    fs.writeFileSync(usersFilePath,JSON.stringify(users,null,2))

    res.json({  
        'message' : "User Deleted Successfully.",
        'userId' : userId
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};