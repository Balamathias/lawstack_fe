"use client"

import React from 'react'
import { Case } from '@/@types/cases'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon, ScaleIcon, FileTextIcon, TagIcon, HistoryIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CaseHeaderProps {
  caseData: Case
  className?: string
}

const CaseHeader: React.FC<CaseHeaderProps> = ({ caseData, className }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      case 'under_review': return 'outline'
      case 'archived': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 dark:text-green-400'
      case 'draft': return 'text-amber-600 dark:text-amber-400'
      case 'under_review': return 'text-blue-600 dark:text-blue-400'
      case 'archived': return 'text-red-600 dark:text-red-400'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <Card className={cn("glass-effect border-border/50 overflow-hidden", className)}>
      <CardContent className="p-8">
        {/* Status and Version */}
        <div className="flex items-center justify-between mb-6">
          <Badge 
            variant={getStatusVariant(caseData.status)}
            className="text-sm font-medium backdrop-blur-sm"
          >
            {caseData.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HistoryIcon className="w-4 h-4" />
            <span>Version {caseData.version}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          {caseData.title}
        </h1>

        {/* Meta Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {caseData.court && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <ScaleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Court</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{caseData.court}</p>
              </div>
            </div>
          )}

          {caseData.year && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Year</h3>
                <p className="text-muted-foreground text-sm">{caseData.year}</p>
              </div>
            </div>
          )}

          {caseData.jurisdiction && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Jurisdiction</h3>
                <p className="text-muted-foreground text-sm">{caseData.jurisdiction}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {caseData.tags && caseData.tags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <TagIcon className="w-4 h-4" />
              <h3 className="font-medium">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {caseData.tags.map((tag) => (
                <Badge 
                  key={tag.id}
                  variant="outline" 
                  className="px-3 py-1 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="mt-8 pt-6 border-t border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {new Date(caseData.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{' '}
              {new Date(caseData.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      </CardContent>
    </Card>
  )
}

export default CaseHeader
