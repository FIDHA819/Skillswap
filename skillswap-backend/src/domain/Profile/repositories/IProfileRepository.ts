import { Profile }
from "../entities/Profile"

export interface IProfileRepository{

create(
profile:Profile
):Promise<Profile>

findByUserId(
userId:string
):Promise<Profile|null>

updateEmail(
userId:string,
email:string
):Promise<any>

update(
userId:string,
data:any
):Promise<any>

}