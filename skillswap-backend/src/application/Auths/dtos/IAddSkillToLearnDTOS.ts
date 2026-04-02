export interface IAddSkillDTO {
  userId: string;
  skillName: string;
  category: string;
  level: "beginner" | "intermediate" | "expert";
}
