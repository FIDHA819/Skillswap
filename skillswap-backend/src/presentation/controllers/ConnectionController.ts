import { Response } from "express";
import mongoose from "mongoose";
import { ConnectionModel } from "../../infrastructure/database/models/ConnectionModel";
import { NotificationModel } from "../../infrastructure/database/models/NotificationModel";
import { UserModel } from "../../infrastructure/database/models/UserModel";
import { ProfileModel } from "../../infrastructure/database/models/ProfileModel";

export class ConnectionController {

  // POST /connections/connect/:teacherId
  // Student sends a connect request to a teacher
  static async connect(req: any, res: Response) {
    try {
      const studentId = req.user.id;
      const { teacherId } = req.params;
      const { message = "" } = req.body;

      if (studentId === teacherId) {
        return res.status(400).json({ message: "Cannot connect with yourself" });
      }

      // Check teacher exists and is a teacher role
      const teacher = await UserModel.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      // Upsert — if already exists return current status
      const existing = await ConnectionModel.findOne({ studentId, teacherId });
      if (existing) {
        return res.status(409).json({
          message: "Connection already exists",
          status: existing.status,
        });
      }

      // Create connection
      const connection = await ConnectionModel.create({
        studentId,
        teacherId,
        message,
        status: "pending",
      });

      // Get student info for notification
      const student = await UserModel.findById(studentId, "fullName email");
      const studentProfile = await ProfileModel.findOne(
        { userId: String(studentId) },
        "photoUrl"
      );

      // Notify teacher: "StudentX wants to connect with you"
      await NotificationModel.create({
        recipientId: new mongoose.Types.ObjectId(teacherId),
        senderId:    new mongoose.Types.ObjectId(studentId),
        type:        "connect_request",
        title:       "New Connection Request",
        message:     `${student?.fullName ?? "A student"} wants to connect with you`,
        metadata: {
          connectionId: connection._id,
          studentId,
          studentName:   student?.fullName,
          studentPhoto:  studentProfile?.photoUrl ?? null,
        },
      });

      return res.status(201).json({ success: true, status: "pending", connectionId: connection._id });
    } catch (error: any) {
      // duplicate key = already exists
      if (error.code === 11000) {
        return res.status(409).json({ message: "Already connected" });
      }
      console.error("connect error:", error);
      return res.status(500).json({ message: "Failed to connect" });
    }
  }

  // GET /connections/status/:teacherId  — check if current user already connected
  static async getStatus(req: any, res: Response) {
    try {
      const studentId = req.user.id;
      const { teacherId } = req.params;

      const connection = await ConnectionModel.findOne({ studentId, teacherId });
      if (!connection) return res.json({ status: "none" });

      return res.json({ status: connection.status, connectionId: connection._id });
    } catch (error) {
      return res.status(500).json({ message: "Failed to get status" });
    }
  }

  // PATCH /connections/:connectionId/accept  — teacher accepts
  static async accept(req: any, res: Response) {
    try {
      const teacherId = req.user.id;
      const { connectionId } = req.params;

      const connection = await ConnectionModel.findOneAndUpdate(
        { _id: connectionId, teacherId, status: "pending" },
        { status: "accepted" },
        { new: true }
      );

      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }

      // Notify student that teacher accepted
      const teacher = await UserModel.findById(teacherId, "fullName");
      await NotificationModel.create({
        recipientId: connection.studentId,
        senderId:    new mongoose.Types.ObjectId(teacherId),
        type:        "connect_accepted",
        title:       "Connection Accepted!",
        message:     `${teacher?.fullName ?? "The teacher"} accepted your connection request`,
        metadata:    { connectionId, teacherId },
      });

      return res.json({ success: true, status: "accepted" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to accept" });
    }
  }

  // PATCH /connections/:connectionId/decline  — teacher declines
  static async decline(req: any, res: Response) {
    try {
      const teacherId = req.user.id;
      const { connectionId } = req.params;

      const connection = await ConnectionModel.findOneAndUpdate(
        { _id: connectionId, teacherId, status: "pending" },
        { status: "declined" },
        { new: true }
      );

      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }

      return res.json({ success: true, status: "declined" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to decline" });
    }
  }

  // GET /connections/requests  — teacher sees pending requests
  static async getRequests(req: any, res: Response) {
    try {
      const teacherId = req.user.id;

      const requests = await ConnectionModel
        .find({ teacherId, status: "pending" })
        .populate("studentId", "fullName email")
        .sort({ createdAt: -1 })
        .lean();

      // Enrich with student profiles
      const enriched = await Promise.all(
        requests.map(async (r) => {
          const profile = await ProfileModel.findOne(
            { userId: String((r.studentId as any)._id) },
            "photoUrl country headline"
          ).lean();
          return { ...r, studentProfile: profile };
        })
      );

      return res.json(enriched);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch requests" });
    }
  }

static async getMyStudents(req: any, res: Response) {
  try {
    const teacherId = req.user.id;
 
    const connections = await ConnectionModel
      .find({ teacherId, status: "accepted" })
      .populate("studentId", "fullName email role")
      .sort({ updatedAt: -1 })
      .lean();
 
    const enriched = await Promise.all(
      connections.map(async (c) => {
        const student = c.studentId as any;
        const profile = await ProfileModel.findOne(
          { userId: String(student._id) },
          "photoUrl country headline"
        ).lean();
        return {
          connectionId: c._id,
          connectedAt: c.updatedAt,
          student: { ...student, profile },
        };
      })
    );
 
    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch students" });
  }
}
 
// GET /connections/my-teachers  — learner sees accepted teachers
static async getMyTeachers(req: any, res: Response) {
  try {
    const studentId = req.user.id;
 
    const connections = await ConnectionModel
      .find({ studentId, status: "accepted" })
      .populate("teacherId", "fullName email role")
      .sort({ updatedAt: -1 })
      .lean();
 
    const enriched = await Promise.all(
      connections.map(async (c) => {
        const teacher = c.teacherId as any;
        const profile = await ProfileModel.findOne(
          { userId: String(teacher._id) },
          "photoUrl country headline rating totalStudents skillsToTeach"
        ).lean();
        const skills = await SkillModel.find(
          { teachers: teacher._id },
          "name"
        ).lean();
        return {
          connectionId: c._id,
          connectedAt: c.updatedAt,
          teacher: { ...teacher, profile, skills: skills.map(s => s.name) },
        };
      })
    );
 
    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch teachers" });
  }
}
 
  
}



