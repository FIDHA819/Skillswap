// src/application/User/use-cases/UpdateProfileUseCase.ts
import { IUserRepository } from "../../Auth/repositories/IUserRepository";
import { IFileUploader } from "../../Auth/providers/IFileUploader";

export class UpdateProfileUseCase {
  constructor(private userRepo: IUserRepository, private fileUploader: IFileUploader) {}

  async execute(userId: string, profileData: any) {
    const existingUser = await this.userRepo.findById(userId);
    if (!existingUser) throw new Error("User not found");

    const update: any = { ...(profileData || {}) };

    // parse stringified arrays
    if (typeof update.skillsToLearn === "string") {
      try { update.skillsToLearn = JSON.parse(update.skillsToLearn); } catch { update.skillsToLearn = []; }
    }
    if (typeof update.skillsToTeach === "string") {
      try { update.skillsToTeach = JSON.parse(update.skillsToTeach); } catch { update.skillsToTeach = []; }
    }

    // file may be on profileData.file
    const fileObj = profileData?.file;
    if (fileObj && fileObj.buffer) {
      const uploadedUrl = await this.fileUploader.uploadBuffer(
        fileObj.buffer,
        fileObj.originalname || "photo.jpg",
        "profiles"
      );
      update.profilePhoto = uploadedUrl;
    }

    delete update.file; // don't persist file object

    const updatedUser = await this.userRepo.update(userId, update);
    return updatedUser;
  }
}
