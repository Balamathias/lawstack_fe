import { Suspense } from "react";
import { getCase } from "@/services/server/cases";

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
            url: `https://lawstack.me/cases/${resolvedParams.id}/image`,
            width: 800,
            height: 600,
            },
        ],
        },
    };
}

export default async function CaseDetailPage({ params }: Params) {
  const resolvedParams = await params;
  return (
    <div>
        
    </div>
  );
}
