const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "librarian"],
      default: "student",
    },
    avatar: {
      type: String,
    },
    // for user pwd change
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    fine: {
      type: Number,
      default: 0,
    },
    booksBorrowed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      }
    ],
    booksBorrowingCurrently: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      }
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
