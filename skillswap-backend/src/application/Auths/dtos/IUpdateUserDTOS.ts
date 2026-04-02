export interface IUpdateUserDTOS{
    fullname:string;
    profilephoto:string;
    nickname:string;
    gender?:'male'|'female'|'other';
    country:string;
    birthday?:Date;
    language:string;
    status?:'pending'|'active'|'inactive'
}