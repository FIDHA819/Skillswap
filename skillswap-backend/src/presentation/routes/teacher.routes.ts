// ── teacher.routes.ts  (public, no auth) ─────────────────────────────────────
import express from "express";
import { TeacherPublicController } from "../controllers/TeacherPublicController";
 
const router3 = express.Router();
 
router3.get("/:id", TeacherPublicController.getProfile);
 
export default router3;
 
 