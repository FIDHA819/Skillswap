import { Router } from "express";
import { SkillController } from "../controllers/skill.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/my-skills", authMiddleware, SkillController.getMySkills);
router.put("/my-skills", authMiddleware, SkillController.saveMySkills);
router.post("/my-skills/add", authMiddleware, SkillController.addMySkill);
router.delete("/my-skills/remove", authMiddleware, SkillController.removeMySkill);

router.get("/learner/my-skills", authMiddleware, SkillController.getLearnerSkills);
router.post("/learner/my-skills", authMiddleware, SkillController.saveLearnerSkills);

router.get("/all", authMiddleware, SkillController.getAllSkills);
router.get("/:skillName/teachers", SkillController.getTeachersBySkill);
router.get("/by-name/:skillName/teachers", SkillController.getTeachersBySkillName);

export default router;