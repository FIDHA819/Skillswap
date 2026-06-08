import type { TeacherProfile } from "../../../../domain/entities/teacher"

interface Props{
 profile:TeacherProfile
}

export default function TeacherExperience({
 profile
}:Props){

return(

<div className="tp-card">

<h3>

Experience

</h3>

<p>

{profile.experienceYears}
 Years

</p>

</div>

)

}