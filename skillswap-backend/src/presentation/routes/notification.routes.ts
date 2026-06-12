// ── notification.routes.ts ────────────────────────────────────────────────────
import express from "express";
import { NotificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../middleware/auth.middleware";
 
const router = express.Router();
 
router.get("/",               authMiddleware, NotificationController.getAll);
router.get("/unread-count",   authMiddleware, NotificationController.unreadCount);
router.patch("/read-all",     authMiddleware, NotificationController.markAllRead);
router.patch("/:id/read",     authMiddleware, NotificationController.markRead);
router.delete("/:id",         authMiddleware, NotificationController.deleteOne);
 
export default router;