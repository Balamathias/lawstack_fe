import GlobeSection from "@/components/home/globe-section";
import HeroSection from "@/components/home/hero-section";
import NeuralSection from "@/components/home/neural-section";

export default async function Home() {
  return (
    <div className="p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl flex flex-col items-center justify-center gap-y-5 py-10">
        <HeroSection />
        <GlobeSection />
        <NeuralSection />
      </div>
    </div>
  );
}
