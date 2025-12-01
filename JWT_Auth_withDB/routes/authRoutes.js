const express = require('express')
const router = express.Router()
const { login, logout } = require('../controllers/authController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.post('/login',login)

router.use(verifyToken)
router.post('/logout',logout)

module.exports = router