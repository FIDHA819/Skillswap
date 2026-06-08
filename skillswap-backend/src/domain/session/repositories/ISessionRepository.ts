export interface ISessionRepository{

 create(data:any):Promise<any>

 findLiveByTeacher(
   teacherId:string
 ):Promise<any[]>

 findLecturesByTeacher(
   teacherId:string
 ):Promise<any[]>

 delete(
   id:string
 ):Promise<void>
}