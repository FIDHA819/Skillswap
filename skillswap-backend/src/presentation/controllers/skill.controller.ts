import { Request, Response } from "express";
import mongoose from "mongoose";
import UserModel from "../../infrastructure/database/models/UserModel";
import SkillModel from "../../infrastructure/database/models/SkillModel";
import {AuthRequest} from "../../types/AuthRequest"
import { ProfileModel } from "../../infrastructure/database/models/ProfileModel";
 


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
  // SkillController.ts

// GET /skills/all  — every skill name for the "View All" panel
static async getAllSkills(req: Request, res: Response) {
  try {
    const skills = await SkillModel.find({}, "name description teachers")
      .lean()
    return res.json(skills)
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch skills" })
  }
}

// GET /skills/:skillName/teachers  — teachers who teach this skill
static async getTeachersBySkill(req: Request, res: Response) {
  try {
    const { skillName } = req.params

    const skill = await SkillModel
      .findOne({ name: decodeURIComponent(skillName) })
      .populate({
        path: "teachers",
        select: "_id fullName email role profileCompleted"
      })
      .lean()

    if (!skill) return res.json({ teachers: [], skill: skillName })

    // Also fetch their profiles for photo/headline
    const teacherIds = (skill.teachers as any[]).map(t => t._id)
// console.log("SKILL:", skill)

// console.log(
//   "TEACHERS:",
//   skill?.teachers
// )

// console.log(
//   "TEACHER IDS:",
//   (skill?.teachers as any[]).map(
//     t => t._id
//   )
// )
   const profiles =
await ProfileModel.find({
  userId: { $in: teacherIds }
})
.lean()

// console.log(
//   "PROFILES:",
//   profiles
// )
    const profileMap = Object.fromEntries(
      profiles.map(p => [p.userId, p])
    )

    const enriched = (skill.teachers as any[]).map(teacher => ({
      ...teacher,
      profile: profileMap[teacher._id.toString()] ?? null
    }))

    return res.json({ teachers: enriched, skill: skill.name })
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch teachers" })
  }
}
}