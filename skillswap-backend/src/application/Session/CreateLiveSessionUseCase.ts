import { ISessionRepository } from "../../domain/session/repositories/ISessionRepository"
import { IMeetingProvider } from "../../domain/session/repositories/IMeetingProvider"

export class CreateLiveSessionUseCase {

  constructor(
    private sessionRepo: ISessionRepository,
    private meetingProvider: IMeetingProvider
  ) {}

  async execute(data: any) {

    const startTime = new Date(
      `${data.date}T${data.time}:00`
    )

    const endTime = new Date(
      startTime.getTime() +
      data.durationMins * 60000
    )

    const meetLink =
      await this.meetingProvider.createMeeting(
        data.title,
        data.description,
        startTime,
        endTime
      )

    return this.sessionRepo.create({
      ...data,
      meetLink,
      status: "upcoming"
    })
  }
}