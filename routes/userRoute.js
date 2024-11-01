const express = require("express");
const {
  signup,
  login,
  refreshToken,
  getAllUsers,
  getSingleUser,
} = require("../controller/userController");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/authToken");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/get/users", authenticateToken, getAllUsers);
router.get("/get/single/user", authenticateToken, getSingleUser);

module.exports = router;
