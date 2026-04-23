import { Response } from "express"
import { AuthRequest } from "../../types/AuthRequest"

import { GetCategoriesUseCase } from "../../application/LearnerDashboard/Use-Cases/GetCategoriesUseCae"
import { GetSuggestedMatchesUseCase } from "../../application/LearnerDashboard/Use-Cases/GetSuggestedMatchUseCase"
import { GetPendingRequestsUseCase } from "../../application/LearnerDashboard/Use-Cases/GetPendingRequest"
import { GetUpcomingSessionsUseCase } from "../../application/LearnerDashboard/Use-Cases/GetUpcomingSessionUseCase"
import { SearchTeachersUseCase } from "../../application/LearnerDashboard/Use-Cases/SearchTeacheruseCase"


export class LearnerDashboardController {

  constructor(
    private getCategoriesUseCase: GetCategoriesUseCase,
    private getMatchesUseCase: GetSuggestedMatchesUseCase,
    private getRequestsUseCase: GetPendingRequestsUseCase,
    private getSessionsUseCase: GetUpcomingSessionsUseCase,
    private searchTeachersUseCase: SearchTeachersUseCase
  ) {}

  async categories(req: AuthRequest, res: Response) {

    const categories =
      await this.getCategoriesUseCase.execute()

    res.json(categories)

  }


  async matches(req: AuthRequest, res: Response) {

    const matches =
      await this.getMatchesUseCase.execute(req.user.id)

    res.json(matches)

  }


  async pendingRequests(req: AuthRequest, res: Response) {

    const requests =
      await this.getRequestsUseCase.execute(req.user.id)

    res.json(requests)

  }


  async upcomingSessions(req: AuthRequest, res: Response) {

    const sessions =
      await this.getSessionsUseCase.execute(req.user.id)

    res.json(sessions)

  }


  async search(req: AuthRequest, res: Response) {

    const keyword = req.query.keyword as string

    const results =
      await this.searchTeachersUseCase.execute(keyword)

    res.json(results)

  }

}