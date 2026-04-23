import { ISwapRequestRepository } from "../../../domain/repositories/ISwapRepository"
import { SwapRequest } from "../../../domain/entities/SwapRequest"

export class GetPendingRequestsUseCase {

  constructor(
    private swapRequestRepository: ISwapRequestRepository
  ) {}

  async execute(userId: string): Promise<SwapRequest[]> {

    return this.swapRequestRepository.getPendingRequests(userId)

  }

}