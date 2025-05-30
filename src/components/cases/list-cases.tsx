import { getCases } from '@/services/server/cases'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Case } from '@/@types/cases'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon, ScaleIcon, FileTextIcon, TagIcon } from 'lucide-react'
import { convertMarkdownToPlainText } from '@/lib/utils'

const ListCases = async () => {
  const { data: cases, error } = await getCases()

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <FileTextIcon className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Failed to load cases</h3>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </div>
    )
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <FileTextIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No cases found</h3>
            <p className="text-muted-foreground">Start by adding your first case</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Legal Cases</h1>
        <p className="text-muted-foreground">Browse through all available legal cases and precedents</p>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem: Case, index: number) => (
          <Link 
            key={caseItem.id} 
            href={`/dashboard/cases/${caseItem.id}`}
            className="group"
          >
            <Card className="glass-effect hover:scale-[1.02] transition-all duration-300 border-border/50 hover:border-primary/30 h-full animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}>
              
              {/* Status Indicator */}
              <div className="absolute top-4 right-4 z-10">
                <Badge 
                  variant={
                    caseItem.status === 'published' ? 'default' :
                    caseItem.status === 'draft' ? 'secondary' :
                    caseItem.status === 'under_review' ? 'outline' :
                    'destructive'
                  }
                  className="text-xs font-medium backdrop-blur-sm"
                >
                  {caseItem.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
                  {caseItem.title}
                </CardTitle>
                
                {/* Case Meta Info */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {caseItem.court && (
                    <div className="flex items-center gap-2">
                      <ScaleIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{caseItem.court}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between gap-2">
                    {caseItem.year && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{caseItem.year}</span>
                      </div>
                    )}
                    
                    {caseItem.jurisdiction && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate text-xs">{caseItem.jurisdiction}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Summary */}
                {caseItem.summary && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {convertMarkdownToPlainText(caseItem.summary)}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {caseItem.tags && caseItem.tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TagIcon className="w-3 h-3" />
                      <span>Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {caseItem.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag.id}
                          variant="outline" 
                          className="text-xs px-2 py-0.5 backdrop-blur-sm border-border/50"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                      {caseItem.tags.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-0.5 backdrop-blur-sm border-border/50"
                        >
                          +{caseItem.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-2 border-t border-border/30">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Version {caseItem.version}</span>
                    <span>{new Date(caseItem.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {cases.length >= 12 && (
        <div className="flex justify-center pt-8">
          <button className="glass-effect px-6 py-3 rounded-lg border border-border/50 hover:border-primary/30 text-foreground hover:text-primary transition-all duration-200 font-medium">
            Load More Cases
          </button>
        </div>
      )}
    </div>
  )
}

export default ListCases