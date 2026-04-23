import { Session } from "../entities/Session"

export interface ISessionRepository {

  createSession(session: Session): Promise<void>

  getUpcomingSessions(
    userId: string
  ): Promise<Session[]>

  getSessionsByTeacher(
    teacherId: string
  ): Promise<Session[]>

  getSessionsByLearner(
    learnerId: string
  ): Promise<Session[]>

}