import express from "express"
import { ProfileController } from "../controllers/ProfileController";
import {authMiddleware} from '../middleware/auth.middleware';
import { upload } from "../../infrastructure/services/IFileUploader"

const router = express.Router()

console.log("PROFILE ROUTE FILE LOADED")

router.post(

  "/create",

  authMiddleware,

  upload.single("photo"),

  ProfileController.create

)
router.get(
  "/me",
  authMiddleware,
  ProfileController.me
)
router.patch(

"/update",

authMiddleware,

upload.single(
"photo"
),

ProfileController.update

)

router.post(

"/change-email",

authMiddleware,

ProfileController.changeEmail

)
router.post(
"/verify-email",
authMiddleware,
ProfileController.verifyEmail
)

router.get(

"/teacher",

authMiddleware,

ProfileController.teacherProfile

)

router.patch(

"/teacher",

authMiddleware,

ProfileController.updateTeacherProfile

)
export default router