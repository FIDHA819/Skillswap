import express from "express"
import { authMiddleware } from "../middleware/auth.middleware"
import { LearnerDashboardController } from "../controllers/LearnerDashboard.controller"


export const learnerRoutes = (
  controller: LearnerDashboardController
) => {

  const router = express.Router()

  router.get(
    "/categories",
    authMiddleware,
    controller.categories.bind(controller)
  )

  router.get(
    "/matches",
    authMiddleware,
    controller.matches.bind(controller)
  )

  router.get(
    "/requests",
    authMiddleware,
    controller.pendingRequests.bind(controller)
  )

  router.get(
    "/sessions",
    authMiddleware,
    controller.upcomingSessions.bind(controller)
  )

  router.get(
    "/search",
    authMiddleware,
    controller.search.bind(controller)
  )

  return router

}