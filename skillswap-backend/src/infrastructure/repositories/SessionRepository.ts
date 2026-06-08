import SessionModel from "../database/models/SessionModel"

export class SessionRepository {

 async create(data:any){
   return SessionModel.create(data)
 }

 async findLiveByTeacher(
   teacherId:string
 ){
   return SessionModel.find({
      teacherId,
      type:"live"
   })
 }

 async findLecturesByTeacher(
   teacherId:string
 ){
   return SessionModel.find({
      teacherId,
      type:"recorded"
   })
 }

 async delete(id:string){
   await SessionModel.findByIdAndDelete(id)
 }
}