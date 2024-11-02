const { User } = require("../models/users");

const saveSocketIdAndStatus = async (email, socket_id, status) => {
  if (!email || !status) {
    throw new Error("email and status are required");
  }
  if (status === "online") {
    try {
      const usr = await User.findOneAndUpdate({ email }, { status, lastSeen: null }, { new: true }).select("-password -profilePicture -updatedAt -createdAt");
      return usr;
    } catch (error) {
      console.log(error);
    }
  } else {
    const now = new Date();
    try {
      const usr = await User.findOneAndUpdate({ email }, { status, lastSeen: now }, { new: true }).select("-password -profilePicture -updatedAt -createdAt");
      return usr;
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = { saveSocketIdAndStatus };
