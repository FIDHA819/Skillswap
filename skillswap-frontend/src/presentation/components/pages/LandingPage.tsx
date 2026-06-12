import Navbar from "../hooks/Landing/Navbar";
import HeroSection from "../hooks/Landing/HeroSection";
import SwapPreview from "../hooks/Landing/SwapPreview";
import StatsStrip from "../hooks/Landing/StatsStrip";
import Categories from "../hooks/Landing/CategoriesGrid";
import HowItWorks from "../hooks/Landing/HowItWork";
import Testimonials from "../hooks/Landing/Testimonials";
import Newsletter from "../hooks/Landing/NewsletterCTA";
import Footer from "../hooks/Footer";
import AnimatedBackground from "../hooks/AnimatedBackground";
import Timeline from "../hooks/Landing/Timeline";
import Comparison from "../hooks/Landing/Comparison";
import CommunityHighlights from "../hooks/Landing/CommunityHighlight";
export default function LandingPage() {

  return (
<div className="relative min-h-screen bg-[#030712] text-white overflow-hidden">
  <AnimatedBackground />

  <Navbar />
  <HeroSection />
  <SwapPreview />
  <StatsStrip />
  <Categories />
  <Timeline />
  <Comparison />
  <CommunityHighlights />
  <Testimonials />
  <Newsletter />
  <Footer />
</div>

);
}