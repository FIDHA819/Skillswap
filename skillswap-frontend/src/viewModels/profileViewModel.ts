// src/viewmodels/ProfileViewModel.ts
import { makeAutoObservable } from "mobx"; // or any state lib, can also use React's useState inside custom hook
import { Profile, Skill, BankDetails } from "../models/Profile.model";
import { userService } from "../services/userService";
import { bankService } from "../services/bankService";

export class ProfileViewModel {
  profile: Profile = {
    fullName: "",
    nickname: "",
    gender: "",
    country: "",
    language: "",
    birthday: "",
    skillsToLearn: [],
    skillsToTeach: [],
    bankDetails: undefined,
    kycStatus: "pending",
  };

  loading: boolean = false;
  message: { type: "error" | "success"; text: string } | null = null;

  constructor() {
    makeAutoObservable(this); // MobX example
  }

  async fetchProfile() {
    try {
      this.loading = true;
      const res = await userService.getProfile();
      this.profile = { ...this.profile, ...res };
    } catch (err) {
      this.message = { type: "error", text: "Failed to fetch profile" };
    } finally {
      this.loading = false;
    }
  }

  updateProfileField<K extends keyof Profile>(field: K, value: Profile[K]) {
    this.profile[field] = value;
  }

  addSkillToLearn(skill: Skill) {
    this.profile.skillsToLearn.push(skill);
  }

  addSkillToTeach(skill: Skill) {
    this.profile.skillsToTeach.push(skill);
  }

  async saveProfile() {
    try {
      this.loading = true;
      await userService.updateProfile(this.profile);
      this.message = { type: "success", text: "Profile saved successfully!" };
    } catch (err) {
      this.message = { type: "error", text: "Failed to save profile" };
    } finally {
      this.loading = false;
    }
  }

  async addBank(bank: BankDetails, file: File) {
    try {
      this.loading = true;
      const formData = new FormData();
      formData.append("bankName", bank.bankName);
      formData.append("accountNumber", bank.accountNumber);
      formData.append("ifsc", bank.ifsc);
      formData.append("document", file);

      const res = await bankService.submit(formData);
      this.profile.bankDetails = { ...bank, documentUrl: res.documentUrl };
      this.message = { type: "success", text: "Bank account added successfully" };
    } catch (err) {
      this.message = { type: "error", text: "Failed to add bank account" };
    } finally {
      this.loading = false;
    }
  }
}
