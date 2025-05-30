import { Suspense } from "react";
import { Metadata } from "next";
import ListCases from "@/components/cases/list-cases";
import Loader from "@/components/loader";
import Image from "next/image";


export const metadata: Metadata  = {
  title: "Cases | LawStack",
  description: "Explore, analyze, and manage legal cases with advanced AI and beautiful UI.",
};

export default async function CasesPage() {
  return (
    <div className='max-w-7xl mx-auto w-full px-4 pb-20 pt-4 md:pt-8 lg:pt-12 max-lg:mt-14 space-y-6 animate-fade-in'>
      <Suspense fallback={<Loader variant="dots" />}>
        <ListCases />
      </Suspense> 
    </div>
  );
}
