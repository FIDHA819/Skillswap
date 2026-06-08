import express from "express"
import { authMiddleware } from "../middleware/auth.middleware"
import { SessionController } from "../controllers/SessionController"
import { upload } from "../../infrastructure/services/IFileUploader"

const router = express.Router()

router.get(
 "/teacher/sessions/live",
 authMiddleware,
 SessionController.getLive
)

router.get(
 "/teacher/sessions/lectures",
 authMiddleware,
 SessionController.getLectures
)

router.post(
 "/teacher/sessions/live",
 authMiddleware,
 SessionController.createLive
)

router.post(
 "/teacher/sessions/lectures",
 authMiddleware,
 upload.single("video"),
 SessionController.uploadLecture
)

router.delete(
 "/teacher/sessions/:id",
 authMiddleware,
 SessionController.delete
)

export default router