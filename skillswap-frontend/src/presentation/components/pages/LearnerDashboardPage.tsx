import { useAuth } from "../../../contexts/AuthContext"
import LearnerHomeRouter from "../../components/pages/LearnerhomeRouter"

export default function LearnerDashboardPage() {

const {
loading,
user
}=useAuth()

if(loading){

return(

<div
style={{
height:"100vh",
display:"grid",
placeItems:"center"
}}
>

Loading...

</div>

)

}

return(

<LearnerHomeRouter
user={user}
/>

)

}