import { SwapRequest } from "../entities/SwapRequest"

export interface ISwapRequestRepository {

  createRequest(request: SwapRequest): Promise<void>

  getPendingRequests(userId: string): Promise<SwapRequest[]>

  updateStatus(
    requestId: string,
    status: "accepted" | "rejected"
  ): Promise<void>

  getRequestsSentByUser(
    userId: string
  ): Promise<SwapRequest[]>

}