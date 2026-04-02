import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({

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

  otp: String,

otpExpires: Date,



})

export const UserModel =
  mongoose.model("User", UserSchema)