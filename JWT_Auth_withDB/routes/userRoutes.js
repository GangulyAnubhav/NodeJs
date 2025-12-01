const express = require('express')
const router = express.Router()
const { getUser, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.use(verifyToken)
router.get('/users',getUser)
router.get('/users/:id',getUserById)
router.post('/users',createUser)
router.patch('/users/:id',updateUser)
router.delete('/users/:id',deleteUser)

module.exports = router