import Navbar from "../components/layout/navbar";
import HeroSection from "./components/HeroSection";
import FeaturesGrid from "./components/FeaturesGrid";
import HowItWorks from "./components/HowItWorks";
import ImageShowcase from "./components/ImageShowcase";
import ImpactStats from "./components/ImpactStats";
import CTASection from "./components/CTASection";
import Footer from "../components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* <Navbar /> */}
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <ImageShowcase />
      <ImpactStats />
      <CTASection />
      {/* <Footer /> */}
    </div>
  );
}
