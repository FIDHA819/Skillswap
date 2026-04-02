export interface IAddSkillToTeachDTOS{
    userId:string;
    name:string;
    category:string;
    introduction:string;
    highestQuality:String;
    level?:'beginer'|'intermediate'|'expert';
    mode?:'paid'|'free'
}