import { Request, Response } from "express";
import mongoose from "mongoose";
import UserModel from "../../infrastructure/database/models/UserModel";
import SkillModel from "../../infrastructure/database/models/SkillModel";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class SkillController {
  async getMySkills(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await UserModel.findById(req.user.id)
        .populate({
          path: "skillsToTeach",
          select: "_id name description categoryId teachers learners createdAt updatedAt",
        });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        skillsToTeach: user.skillsToTeach,
      });
    } catch (error: any) {
      console.error("GET MY SKILLS ERROR:", error);
      return res.status(500).json({
        message: error.message || "Failed to fetch skills",
      });
    }
  }

  async saveMySkills(req: AuthRequest, res: Response) {
    const session = await mongoose.startSession();

    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { skillsToTeach } = req.body as { skillsToTeach?: string[] };

      if (!Array.isArray(skillsToTeach)) {
        return res.status(400).json({ message: "skillsToTeach must be an array" });
      }

      const cleanedNames = [...new Set(
        skillsToTeach
          .map((s) => String(s).trim())
          .filter(Boolean)
      )];

      session.startTransaction();

      const user = await UserModel.findById(req.user.id).session(session);
      if (!user) {
        await session.abortTransaction();
        return res.status(404).json({ message: "User not found" });
      }

      const oldSkillIds = user.skillsToTeach.map((id) => id.toString());
      if (oldSkillIds.length > 0) {
        await SkillModel.updateMany(
          { _id: { $in: oldSkillIds } },
          { $pull: { teachers: user._id } },
          { session }
        );
      }

      const finalSkillIds: mongoose.Types.ObjectId[] = [];

      for (const skillName of cleanedNames) {
        let skill = await SkillModel.findOne({ name: skillName }).session(session);

        if (!skill) {
          skill = await SkillModel.create(
            [
              {
                name: skillName,
                description: "",
                teachers: [user._id],
                learners: [],
              },
            ],
            { session }
          ).then((docs) => docs[0]);
        } else {
          await SkillModel.updateOne(
            { _id: skill._id },
            { $addToSet: { teachers: user._id } },
            { session }
          );
        }

        finalSkillIds.push(skill._id as mongoose.Types.ObjectId);
      }

      user.skillsToTeach = finalSkillIds;
      await user.save({ session });

      await session.commitTransaction();

      const updatedUser = await UserModel.findById(req.user.id).populate({
        path: "skillsToTeach",
        select: "_id name description categoryId teachers learners createdAt updatedAt",
      });

      return res.status(200).json({
        skillsToTeach: updatedUser?.skillsToTeach || [],
      });
    } catch (error: any) {
      await session.abortTransaction();
      console.error("SAVE MY SKILLS ERROR:", error);
      return res.status(500).json({
        message: error.message || "Failed to save skills",
      });
    } finally {
      session.endSession();
    }
  }

  async addMySkill(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { skill } = req.body as { skill?: string };
      const skillName = String(skill || "").trim();

      if (!skillName) {
        return res.status(400).json({ message: "Skill is required" });
      }

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let skillDoc = await SkillModel.findOne({ name: skillName });

      if (!skillDoc) {
        skillDoc = await SkillModel.create({
          name: skillName,
          description: "",
          teachers: [user._id],
          learners: [],
        });
      } else {
        await SkillModel.updateOne(
          { _id: skillDoc._id },
          { $addToSet: { teachers: user._id } }
        );
      }

      await UserModel.updateOne(
        { _id: user._id },
        { $addToSet: { skillsToTeach: skillDoc._id } }
      );

      const updatedUser = await UserModel.findById(req.user.id).populate({
        path: "skillsToTeach",
        select: "_id name description categoryId teachers learners createdAt updatedAt",
      });

      return res.status(200).json({
        skillsToTeach: updatedUser?.skillsToTeach || [],
      });
    } catch (error: any) {
      console.error("ADD MY SKILL ERROR:", error);
      return res.status(500).json({
        message: error.message || "Failed to add skill",
      });
    }
  }

  async removeMySkill(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { skill } = req.body as { skill?: string };
      const skillName = String(skill || "").trim();

      if (!skillName) {
        return res.status(400).json({ message: "Skill is required" });
      }

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const skillDoc = await SkillModel.findOne({ name: skillName });
      if (skillDoc) {
        await UserModel.updateOne(
          { _id: user._id },
          { $pull: { skillsToTeach: skillDoc._id } }
        );

        await SkillModel.updateOne(
          { _id: skillDoc._id },
          { $pull: { teachers: user._id } }
        );
      }

      const updatedUser = await UserModel.findById(req.user.id).populate({
        path: "skillsToTeach",
        select: "_id name description categoryId teachers learners createdAt updatedAt",
      });

      return res.status(200).json({
        skillsToTeach: updatedUser?.skillsToTeach || [],
      });
    } catch (error: any) {
      console.error("REMOVE MY SKILL ERROR:", error);
      return res.status(500).json({
        message: error.message || "Failed to remove skill",
      });
    }
  }
}