import SearchBar from "../hooks/LearnerDashboard/SearchBar"
import CategoriesGrid from "../hooks/LearnerDashboard/CategoriesGrid"
import SuggestedMatches from "../hooks/LearnerDashboard/SuggestedMatches"
import PendingRequests from "../hooks/LearnerDashboard/PendingRequest"
import UpcomingSessions from "../hooks/LearnerDashboard/UpcomingSession"

export default function DiscoveryHome(){

return(

<div className="space-y-12 p-6">

<SearchBar/>

<CategoriesGrid/>

<SuggestedMatches/>

<PendingRequests/>

<UpcomingSessions/>

</div>

)

}