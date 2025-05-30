import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCase } from "@/services/server/cases";
import { CaseDetailClient } from "./case-detail-client";

interface Params {
    params: Promise< {
        id: string;
    }>
}

export async function generateMetadata({ params }: Params) {
  const resolvedParams = await params;
  const { data: caseData } = await getCase(resolvedParams.id);
    return {
        title: caseData?.title || "Case Detail",
        description: caseData?.summary || "Detailed information about the case.",
        openGraph: {
        title: caseData?.title || "Case Detail",
        description: caseData?.summary || "Detailed information about the case.",
        url: `https://lawstack.me/cases/${resolvedParams.id}`,
        images: [
            {
              url: `/cases/gradient.jpg`,
              width: 800,
              height: 600,
            },
        ],
        },
    };
}

export default async function CaseDetailPage({ params }: Params) {
  const resolvedParams = await params;

  const { data: caseData, error } = await getCase(resolvedParams.id);
  
  // Handle error cases
  if (error || !caseData) {
    if (error?.status === 404) {
      redirect('/dashboard/cases?error=not-found');
    }
    redirect('/dashboard/cases?error=fetch-failed');
  }
  
  return (
    <div className='max-w-max mx-auto w-full px-4 pb-20 pt-4 md:pt-8 lg:pt-12 max-lg:mt-14 animate-fade-in'>
      <Suspense fallback={<div>Loading case details...</div>}>
        <CaseDetailClient caseData={caseData} />
      </Suspense>
    </div>
  );
}
