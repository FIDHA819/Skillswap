import { IMeetingProvider } from "../../domain/session/repositories/IMeetingProvider"

export class GoogleMeetProvider
implements IMeetingProvider {

  async createMeeting(
    title: string,
    description: string,
    startTime: Date,
    endTime: Date
  ): Promise<string> {

    // Later integrate Google Calendar API

    return "https://meet.google.com/new"
  }
}