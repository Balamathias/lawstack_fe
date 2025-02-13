import GlobeSection from "@/components/home/globe-section";
import HeroSection from "@/components/home/hero-section";
import { Button } from "@/components/ui/button";

export default function Home() {

  return (
    <div className="p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl flex flex-col items-center justify-center gap-y-5 py-10">
        <HeroSection />
        <GlobeSection />
      </div>
    </div>
  );
}
