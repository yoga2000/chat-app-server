const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const {} = require("../utils/timeChange");
const convertISOTo12Hour = require("../utils/timeChange");
const unreadMessageModel = require("../models/unreadMessageModel");
dotenv.config();

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ message: "All fields are mandatory" });
  try {
    const userexits = await User.find({ email });

    if (userexits.length > 0) return res.status(400).json({ message: "user already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    return res.status(201).json({ message: "success", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usr = await User.find({ email });
    console.log(usr);

    if (!usr[0] || !(await bcrypt.compare(password, usr[0].password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ email: usr[0].email }, process.env.ACCESS_SECRET_KEY, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign({ email: usr[0].email }, process.env.REFRESH_SECRET_KEY, {
      expiresIn: "5d",
    });

    return res.status(200).json({
      result: usr[0].email,
      message: "success",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token provided" });
  }

  try {
    const user = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decodedUser) => {
        if (err) {
          reject("Invalid token");
        } else {
          resolve(decodedUser);
        }
      });
    });

    const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_SECRET_KEY, { expiresIn: "10m" });
    return res.status(201).json({ message: "success", accessToken });
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async (req, res) => {
  const { email } = req.user;

  try {
    const response = await User.find({ email: { $ne: email } });

    const formattedMessages = await Promise.all(
      response.map(async (user) => ({
        unreadMsg: (await unreadMessageModel.find({ userId: user._id }).select("unreadCount")) || 0,
        _id: user._id,
        empId: user.empId,
        name: user.name,
        email: user.email,
        socket_id: user.socket_id,
        createdAt: user.createdAt,
        status: user.status,
        lastSeen: await convertISOTo12Hour(user.lastSeen),
      }))
    );

    return res.status(200).json({ message: "success", data: formattedMessages });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSingleUser = async (req, res) => {
  const { email } = req.user;
  try {
    const response = await User.find({ email: email }).select("-password");
    if (response.length === 0) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "success", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { signup, login, refreshToken, getAllUsers, getSingleUser };
