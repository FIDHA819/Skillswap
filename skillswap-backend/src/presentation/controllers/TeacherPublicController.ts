import { Request, Response } from "express";
import { UserModel } from "../../infrastructure/database/models/UserModel";
import { ProfileModel } from "../../infrastructure/database/models/ProfileModel";
import SessionModel from "../../infrastructure/database/models/SessionModel";
import { SkillModel } from "../../infrastructure/database/models/SkillModel";

export class TeacherPublicController {

  // GET /teacher/:id  — public profile (no auth required)
  static async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id, "fullName email role").lean();
      if (!user) return res.status(404).json({ message: "Teacher not found" });

      const profile = await ProfileModel.findOne({ userId: String(id) }).lean();

      // Sessions: only fetch upcoming live + all recorded (public)
      const [liveSessions, recordedSessions] = await Promise.all([
        SessionModel.find({
          teacherId: id,
          type: "live",
          status: { $in: ["upcoming", "live"] },
        }).sort({ date: 1, time: 1 }).lean(),
        SessionModel.find({
          teacherId: id,
          type: "recorded",
        }).sort({ createdAt: -1 }).lean(),
      ]);

      // Skills this teacher teaches
      const skills = await SkillModel.find(
        { teachers: id },
        "name"
      ).lean();

      return res.json({
        user,
        profile,
        liveSessions,
        recordedSessions,
        skills: skills.map((s) => s.name),
      });
    } catch (error) {
      console.error("teacher profile error:", error);
      return res.status(500).json({ message: "Failed to fetch teacher profile" });
    }
  }
}