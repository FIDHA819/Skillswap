import { Router } from "express";
import { SkillController } from "../controllers/skill.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const skillController = new SkillController();

router.get(
  "/my-skills",
  authMiddleware,
  skillController.getMySkills.bind(skillController)
);

router.put(
  "/my-skills",
  authMiddleware,
  skillController.saveMySkills.bind(skillController)
);

router.post(
  "/my-skills/add",
  authMiddleware,
  skillController.addMySkill.bind(skillController)
);

router.delete(
  "/my-skills/remove",
  authMiddleware,
  skillController.removeMySkill.bind(skillController)
);

export default router;