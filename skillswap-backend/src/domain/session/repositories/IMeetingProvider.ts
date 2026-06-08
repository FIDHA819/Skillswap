export interface IMeetingProvider {
  createMeeting(
    title: string,
    description: string,
    startTime: Date,
    endTime: Date
  ): Promise<string>
}