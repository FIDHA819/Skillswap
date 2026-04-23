import mongoose from "mongoose"


const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  otp: {
    type: String,
    default: null
  },

  otpExpires: {
    type: Date,
    default: null
  },

  // ✅ ADD THESE NEW FIELDS

  skillsToTeach: {
    type: [String],
    default: []
  },

  skillsToLearn: {
    type: [String],
    default: []
  },

  role: {
    type: String,
    enum: ["learner", "teacher"],
    default: "learner"
  },

  profileCompleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
})

export const UserModel =
  mongoose.model("User", userSchema)