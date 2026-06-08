import "../styles/dashboard.css"

import LearnerHeader from "../hooks/LearnerDashboard/LearnerHeader"

import HeroSection from "../hooks/LearnerDashboard/HeroSection"

import CategoriesGrid from "../hooks/LearnerDashboard/CategoriesGrid"

import RecommendedVideos from "../hooks/LearnerDashboard/RecommendedVideos"

import RecommendedTeachers from "../hooks/LearnerDashboard/RecommendedTeachers"

import UpcomingSessions from "../hooks/LearnerDashboard/UpcomingSession"

import DiscoverGain from "../hooks/LearnerDashboard/DiscoverGain"

import Footer from "../hooks/Footer"

export default function DiscoveryHome() {

return(

<div className="dashboard">

<LearnerHeader/>

<main className="dashboard-main">

<HeroSection/>

<CategoriesGrid/>

<RecommendedVideos/>

<RecommendedTeachers/>

<UpcomingSessions/>

<DiscoverGain/>

<Footer/>

</main>

</div>

)

}