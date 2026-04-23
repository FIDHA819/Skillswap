import { ISessionRepository } from "../../../domain/repositories/ISessionRepository"
import { Session } from "../../../domain/entities/Session"

export class GetUpcomingSessionsUseCase {

  constructor(
    private sessionRepository: ISessionRepository
  ) {}

  async execute(userId: string): Promise<Session[]> {

    return this.sessionRepository.getUpcomingSessions(userId)

  }

}