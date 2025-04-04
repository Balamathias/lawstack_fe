import GlobeSection from "@/components/home/globe-section";
import HeroSection from "@/components/home/hero-section";
import NeuralSection from "@/components/home/neural-section";
import EnhancedGridPattern from "@/components/home/svgs/grid";
import Testimonials from "@/components/home/testimonials";
import FooterSection from "@/components/home/footer-section";

export default async function Home() {
  return (
    <div className="p-4 sm:p-8 relative">
      <EnhancedGridPattern />
      <div className="container mx-auto max-w-7xl flex flex-col items-center justify-center gap-y-5 py-10">
        <HeroSection />
        <GlobeSection />
        <NeuralSection />
        <Testimonials />
        <FooterSection />
      </div>
    </div>
  );
}
