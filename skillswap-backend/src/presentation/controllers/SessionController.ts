import { Request, Response } from "express"
import { SessionRepository } from "../../infrastructure/repositories/SessionRepository"

import { GoogleMeetProvider }from "../../infrastructure/services/GoogleMeetProvider"

import { CreateLiveSessionUseCase }from "../../application/Session/CreateLiveSessionUseCase"

const repo = new SessionRepository()

export class SessionController {

 static async createLive(
   req: Request,
   res: Response
 ) {

   const teacherId =
     (req as any).user.id

   const repo =
     new SessionRepository()

   const meetProvider =
     new GoogleMeetProvider()

   const useCase =
     new CreateLiveSessionUseCase(
       repo,
       meetProvider
     )

   const session =
     await useCase.execute({
       ...req.body,
       teacherId,
       type: "live"
     })

   return res.status(201).json(session)
 }

 static async getLive(
  req:Request,
  res:Response
 ){

  const teacherId = (req as any).user.id

   const sessions =
      await repo.findLiveByTeacher(
         teacherId
      )

   res.json(sessions)
 }

 static async delete(
  req:Request,
  res:Response
 ){

   await repo.delete(
      req.params.id
   )

   res.json({
      success:true
   })
 }
 static async uploadLecture(
 req:Request,
 res:Response
){

const teacherId = (req as any).user.id

 const session=
 await repo.create({

   teacherId,

   title:req.body.title,
   subject:req.body.subject,
   description:req.body.description,

   durationMins:Number(
      req.body.durationMins
   ),

   mode:req.body.mode,

   price:req.body.price,

   type:"recorded",

   videoUrl:req.file?.path
 })

 res.status(201).json(session)
}

static async getLectures(
  req: Request,
  res: Response
) {
  try {

    const teacherId = (req as any).user.id

    const lectures =
      await repo.findLecturesByTeacher(
        teacherId
      )

    res.status(200).json(lectures)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to fetch lectures"
    })
  }
}
}