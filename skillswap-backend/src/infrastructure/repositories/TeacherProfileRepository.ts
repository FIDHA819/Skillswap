async updateTeacherProfile(

  userId:string,

  data:any

){

  return await ProfileModel.findOneAndUpdate(

    {userId},

    {$set:data},

    {new:true}

  )

}