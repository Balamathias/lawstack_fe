'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Brain, 
  FileText, 
  BookOpen, 
  Share2, 
  Download, 
  History,
  Eye,
  MessageSquare,
  Search,
  ChevronDown,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Case } from '@/@types/cases'
import { useAnalyzeCase, useSummarizeCase, useSimilarCases } from '@/services/client/cases'

interface CaseActionsProps {
  caseData: Case
  onAction?: (action: string, data?: any) => void
}

export function CaseActions({ caseData, onAction }: CaseActionsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  
  const analyzeCase = useAnalyzeCase()
  const summarizeCase = useSummarizeCase()
  const similarCases = useSimilarCases()

  const handleAnalyze = async () => {
    try {
      const result = await analyzeCase.mutateAsync(caseData.id)
      onAction?.('analyze', result.data)
    } catch (error) {
      console.error('Error analyzing case:', error)
    }
  }

  const handleSummarize = async () => {
    try {
      const result = await summarizeCase.mutateAsync(caseData.id)
      onAction?.('summarize', result.data)
    } catch (error) {
      console.error('Error summarizing case:', error)
    }
  }

  const handleFindSimilar = async () => {
    try {
      const result = await similarCases.mutateAsync(caseData.id)
      onAction?.('similar', result.data)
    } catch (error) {
      console.error('Error finding similar cases:', error)
    }
  }

  const quickActions = [
    {
      id: 'analyze',
      label: 'AI Analysis',
      icon: Brain,
      description: 'Get AI-powered legal analysis',
      action: handleAnalyze,
      loading: analyzeCase.isPending,
      variant: 'default' as const
    },
    {
      id: 'summarize',
      label: 'Summarize',
      icon: FileText,
      description: 'Generate plain English summary',
      action: handleSummarize,
      loading: summarizeCase.isPending,
      variant: 'secondary' as const
    },
    {
      id: 'similar',
      label: 'Find Similar',
      icon: Search,
      description: 'Find related cases',
      action: handleFindSimilar,
      loading: similarCases.isPending,
      variant: 'outline' as const
    }
  ]

  const utilityActions = [
    { id: 'share', label: 'Share Case', icon: Share2 },
    { id: 'download', label: 'Download PDF', icon: Download },
    { id: 'history', label: 'View History', icon: History },
    { id: 'annotations', label: 'Add Notes', icon: MessageSquare }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-br from-background/80 to-muted/50 backdrop-blur-sm border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Case Analysis Tools</h3>
            <p className="text-sm text-muted-foreground">AI-powered legal research and analysis</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {caseData.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              onClick={action.action}
              disabled={action.loading}
              className="h-auto p-4 flex flex-col items-start space-y-2 group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex items-center space-x-2 w-full">
                {action.loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <action.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                )}
                <span className="font-medium">{action.label}</span>
              </div>
              <span className="text-xs text-muted-foreground whitespace-pre-wrap">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Case Information Panel */}
      <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Case Information</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  More Actions
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {utilityActions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => onAction?.(action.id)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <action.icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onAction?.('view_raw')}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Raw Data</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Version</p>
              <p className="font-medium text-foreground">v{caseData.version}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium text-foreground">
                {new Date(caseData.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Updated</p>
              <p className="font-medium text-foreground">
                {new Date(caseData.updated_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Status</p>
              <Badge 
                variant={caseData.status === 'published' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {caseData.status}
              </Badge>
            </div>
          </div>

          {/* Additional metadata */}
          {(caseData.notes || caseData.attachments || caseData.citations) && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {caseData.notes && (
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Has Notes
                  </Badge>
                )}
                {caseData.attachments && (
                  <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                    <Download className="h-3 w-3 mr-1" />
                    Has Attachments
                  </Badge>
                )}
                {caseData.citations && (
                  <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Has Citations
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
