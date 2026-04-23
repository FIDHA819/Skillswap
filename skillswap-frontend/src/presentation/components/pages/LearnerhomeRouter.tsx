import ProfileSetupHome from "../hooks/LearnerDashboard/ProfileSetUpHome"
import AddSkillsHome from "../hooks/LearnerDashboard/AddSkillHome"
import DiscoveryHome from "./DiscoveryhomeRouter"

export default function LearnerHomeRouter({ user }) {

if (!user.profileCompleted)
return <ProfileSetupHome/>

if (!user.skillsToTeach.length)
return <AddSkillsHome/>

return <DiscoveryHome/>

}