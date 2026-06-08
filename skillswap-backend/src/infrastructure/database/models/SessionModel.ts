import mongoose from "mongoose"

const SessionSchema = new mongoose.Schema(
{
  teacherId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  title:String,
  subject:String,
  description:String,

  type:{
    type:String,
    enum:["live","recorded"]
  },

  mode:{
    type:String,
    enum:["free","paid"]
  },

  date:String,
  time:String,

  durationMins:Number,

  price:Number,

  meetLink:String,

  videoUrl:String,

  status:{
    type:String,
    default:"upcoming"
  },

  enrolledCount:{
    type:Number,
    default:0
  }
},
{
  timestamps:true
})

export default mongoose.model(
  "Session",
  SessionSchema
)