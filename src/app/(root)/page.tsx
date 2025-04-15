import GlobeSection from "@/components/home/globe-section";
import HeroSection from "@/components/home/hero-section";
import NeuralSection from "@/components/home/neural-section";
import EnhancedGridPattern from "@/components/home/svgs/grid";
import Testimonials from "@/components/home/testimonials";
import FooterSection from "@/components/home/footer-section";
import PatternBackground from "@/components/home/pattern-background";
import GradientOrbs from "@/components/home/gradient-orbs";

export default async function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <PatternBackground />
      <GradientOrbs />
      
      <div className="relative z-10">
        <HeroSection />
        
        <div className="relative">
          {/* Added subtle diagonal gradient divider */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-emerald-50/5 dark:to-emerald-900/5 -z-10"></div>
          <GlobeSection />
        </div>
        
        <div className="relative">
          {/* Neural network background effect */}
          <div className="absolute inset-0 bg-neural-pattern opacity-[0.03] -z-10"></div>
          <NeuralSection />
        </div>
        
        <div className="relative">
          {/* Testimonial section with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/5 to-green-50/10 dark:from-emerald-900/5 dark:to-green-900/10 -z-10"></div>
          <Testimonials />
        </div>
        
        <FooterSection />
      </div>
    </div>
  );
}
