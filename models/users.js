const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Counter Schema
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 100 },
});

const Counter = mongoose.model("Counter", counterSchema);

// User Schema with fixed empId validation
const userSchema = new Schema(
  {
    empId: { type: String, unique: true, trim: true },

    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    status: { type: String, default: "offline" },
    socket_id: { type: String, default: null },
    lastSeen: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Modified pre-save middleware
userSchema.pre("save", async function (next) {
  try {
    // Only generate empId for new documents
    if (this.isNew && !this.empId) {
      const counter = await Counter.findByIdAndUpdate("employeeId", { $inc: { seq: 1 } }, { new: true, upsert: true });

      this.empId = `EMP${counter.seq}`;
      console.log("Generated empId:", this.empId);
    }
    next();
  } catch (error) {
    console.error("Error in pre-save middleware:", error);
    return next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  Counter,
};
