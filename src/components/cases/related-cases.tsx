'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Scale, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Bookmark,
  ChevronRight,
  Search,
  AlertCircle
} from 'lucide-react'
import { Case } from '@/@types/cases'
import { useSimilarCases } from '@/services/client/cases'
import Link from 'next/link'
import MarkdownPreview from '../markdown-preview'

interface RelatedCasesProps {
  caseId: string
  onCaseSelect?: (caseId: string) => void
}

interface RelatedCase {
  id: string
  title: string
  parties: string
  citation: string
  court: string
  year: number
  summary: string
  is_landmark: boolean
  relationship?: {
    shared_principles_count: number
    shared_principles: string[]
  }
}

export function RelatedCases({ caseId, onCaseSelect }: RelatedCasesProps) {
  
  const {data: similarCases, isPending: loading, isError: error } = useSimilarCases()

  const relatedCasesAISummary = similarCases?.data?.similar_cases || ''

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
        <div className="flex items-center space-x-2 mb-4">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Related Cases</h3>
        </div>
        <LoadingSkeleton />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
        <div className="flex items-center space-x-2 mb-4">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Related Cases</h3>
        </div>
        <div className="flex items-center justify-center py-8 text-center">
          <div className="space-y-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
        <MarkdownPreview content={relatedCasesAISummary} className="p-4 bg-background/50 backdrop-blur border border-border/50 rounded-lg" />
    </div>
  )

//   if (!relatedCases.length) {
//     return (
//       <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
//         <div className="flex items-center space-x-2 mb-4">
//           <Scale className="h-5 w-5 text-primary" />
//           <h3 className="text-lg font-semibold text-foreground">Related Cases</h3>
//         </div>
//         <div className="flex items-center justify-center py-8 text-center">
//           <div className="space-y-2">
//             <Search className="h-8 w-8 text-muted-foreground mx-auto" />
//             <p className="text-sm text-muted-foreground">No related cases found</p>
//             <p className="text-xs text-muted-foreground">
//               Try analyzing this case to discover similar legal precedents
//             </p>
//           </div>
//         </div>
//       </Card>
//     )
//   }

//   return (
//     <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-2">
//           <Scale className="h-5 w-5 text-primary" />
//           <h3 className="text-lg font-semibold text-foreground">Related Cases</h3>
//           <Badge variant="secondary" className="text-xs">
//             {relatedCases.length} found
//           </Badge>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {relatedCases.map((relatedCase, index) => (
//           <Card 
//             key={relatedCase.id || index} 
//             className="p-4 border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200 group cursor-pointer"
//             onClick={() => onCaseSelect?.(relatedCase.id)}
//           >
//             <div className="space-y-3">
//               {/* Case Title and Landmark Badge */}
//               <div className="flex items-start justify-between">
//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
//                     {relatedCase.title}
//                   </h4>
//                   {relatedCase.parties && (
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {relatedCase.parties}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-2 ml-2">
//                   {relatedCase.is_landmark && (
//                     <Badge variant="default" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
//                       <Bookmark className="h-3 w-3 mr-1" />
//                       Landmark
//                     </Badge>
//                   )}
//                   <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
//                 </div>
//               </div>

//               {/* Case Metadata */}
//               <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
//                 {relatedCase.court && (
//                   <div className="flex items-center space-x-1">
//                     <MapPin className="h-3 w-3" />
//                     <span>{relatedCase.court}</span>
//                   </div>
//                 )}
//                 {relatedCase.year && (
//                   <div className="flex items-center space-x-1">
//                     <Calendar className="h-3 w-3" />
//                     <span>{relatedCase.year}</span>
//                   </div>
//                 )}
//                 {relatedCase.citation && (
//                   <div className="flex items-center space-x-1">
//                     <ExternalLink className="h-3 w-3" />
//                     <span className="font-mono">{relatedCase.citation}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Case Summary */}
//               {relatedCase.summary && (
//                 <p className="text-sm text-muted-foreground line-clamp-2">
//                   {relatedCase.summary}
//                 </p>
//               )}

//               {/* Relationship Information */}
//               {relatedCase.relationship && (
//                 <div className="pt-2 border-t border-border/50">
//                   <div className="flex flex-wrap gap-2">
//                     <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
//                       {relatedCase.relationship.shared_principles_count} shared principles
//                     </Badge>
//                     {relatedCase.relationship.shared_principles.slice(0, 2).map((principle, idx) => (
//                       <Badge key={idx} variant="outline" className="text-xs max-w-[200px] truncate">
//                         {principle}
//                       </Badge>
//                     ))}
//                     {relatedCase.relationship.shared_principles.length > 2 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{relatedCase.relationship.shared_principles.length - 2} more
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* View All Button */}
//       {relatedCases.length > 0 && (
//         <div className="mt-4 pt-4 border-t border-border/50">
//           <Button 
//             variant="outline" 
//             className="w-full" 
//             onClick={() => onCaseSelect?.('search')}
//           >
//             <Search className="h-4 w-4 mr-2" />
//             Search for More Similar Cases
//           </Button>
//         </div>
//       )}
//     </Card>
//   )
}
