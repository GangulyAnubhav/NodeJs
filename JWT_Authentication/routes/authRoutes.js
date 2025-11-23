const express = require("express");
const router = express.Router();
const { login, getUsers, logout } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/users", verifyToken, getUsers);
router.post("/logout", logout);

module.exports = router;