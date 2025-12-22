const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/usercontroller');
const fs = require('fs');
const path = require('path');

router.get('/users', getUsers);


router.get('/users/:id', getUserById);

router.post('/users', createUser);

//PUT method is used to replace an entire resource
//PATCH method is used for partial updates to a resource.
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;