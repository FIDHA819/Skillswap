import mongoose from "mongoose"

const profileSchema =
new mongoose.Schema({

id:{
type:String
},

userId:{
type:String,
required:true,
unique:true
},

email:{
type:String,
required:true,
unique:true
},

fullName:String,

nickname:String,

photoUrl:String,

gender:String,

country:String,

language:String,

dob:Date,

qualification:String,

sessionHours:Number,

kycDetails:String,

paymentDetails:String,

profileCompleted:{
type:Boolean,
default:true
}

},{
timestamps:true
})

export const ProfileModel=
mongoose.model(
"Profile",
profileSchema
)