
// ── connection.routes.ts ──────────────────────────────────────────────────────
import express from "express";
import { ConnectionController } from "../controllers/ConnectionController";
import { authMiddleware } from "../middleware/auth.middleware";

 
const router2 = express.Router();
 
router2.post("/:teacherId",                authMiddleware, ConnectionController.connect);
router2.get("/status/:teacherId",          authMiddleware, ConnectionController.getStatus);
router2.get("/requests",                   authMiddleware, ConnectionController.getRequests);
router2.patch("/:connectionId/accept",     authMiddleware, ConnectionController.accept);
router2.patch("/:connectionId/decline",    authMiddleware, ConnectionController.decline);
 router2.get("/my-students", authMiddleware, ConnectionController.getMyStudents);
router2.get("/my-teachers", authMiddleware, ConnectionController.getMyTeachers);
export default router2;
 
 
