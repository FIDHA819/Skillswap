import { Response } from "express";
import { NotificationModel } from "../../infrastructure/database/models/NotificationModel";

export class NotificationController {

  // GET /notifications
  static async getAll(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const page  = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const [notifications, unreadCount] = await Promise.all([
        NotificationModel
          .find({ recipientId: userId })
          .populate("senderId", "fullName email")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        NotificationModel.countDocuments({ recipientId: userId, read: false }),
      ]);

      return res.json({ notifications, unreadCount, page });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch notifications" });
    }
  }

  // GET /notifications/unread-count
  static async unreadCount(req: any, res: Response) {
    try {
      const count = await NotificationModel.countDocuments({
        recipientId: req.user.id,
        read: false,
      });
      return res.json({ count });
    } catch (error) {
      return res.status(500).json({ message: "Failed to get count" });
    }
  }

  // PATCH /notifications/:id/read
  static async markRead(req: any, res: Response) {
    try {
      await NotificationModel.findOneAndUpdate(
        { _id: req.params.id, recipientId: req.user.id },
        { read: true }
      );
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Failed" });
    }
  }

  // PATCH /notifications/read-all
  static async markAllRead(req: any, res: Response) {
    try {
      await NotificationModel.updateMany(
        { recipientId: req.user.id, read: false },
        { read: true }
      );
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Failed" });
    }
  }

  // DELETE /notifications/:id
  static async deleteOne(req: any, res: Response) {
    try {
      await NotificationModel.findOneAndDelete({
        _id: req.params.id,
        recipientId: req.user.id,
      });
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Failed" });
    }
  }
}