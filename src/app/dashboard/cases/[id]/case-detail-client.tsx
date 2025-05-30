'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertCircle, 
  ArrowLeft, 
  ExternalLink,
  RefreshCw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Case } from '@/@types/cases'
import  CaseHeader from '@/components/cases/case-header'
import CaseContent from '@/components/cases/case-content'
import { CaseActions } from '@/components/cases/case-actions'
import { RelatedCases } from '@/components/cases/related-cases'
import { CaseHistory } from '@/components/cases/case-history'
import { CaseNotes } from '@/components/cases/case-notes'
import MarkdownPreview from '@/components/markdown-preview'

interface CaseDetailClientProps {
  caseData: Case
}

export function CaseDetailClient({ caseData }: CaseDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isCompactView, setIsCompactView] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)

  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'analyze':
        setAnalysisData(data)
        setActiveTab('analysis')
        break
      case 'summarize':
        console.log('Summary:', data)
        break
      case 'similar':
        setActiveTab('related')
        break
      case 'share':
        handleShare()
        break
      case 'download':
        handleDownload()
        break
      case 'history':
        setActiveTab('history')
        break
      case 'annotations':
        setActiveTab('notes')
        break
      default:
        console.log('Action:', action, data)
    }
  }

  const handleCaseSelect = (caseId: string) => {
    if (caseId === 'search') {
      router.push('/dashboard/cases?tab=search')
    } else {
      router.push(`/dashboard/cases/${caseId}`)
    }
  }

  const handleVersionChange = (version: number) => {
    // In a real app, you'd fetch the specific version
    console.log('Version changed to:', version)
    // Optionally refresh the page or update the data
    window.location.reload()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: caseData.title,
        text: caseData.summary || 'Legal case details',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
      console.log('URL copied to clipboard')
    }
  }

  const handleDownload = () => {
    // In a real app, you'd generate and download a PDF
    console.log('Download PDF functionality would be implemented here')
  }

  return (
    <div className="space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Cases</span>
          </Button>
          
          <div className="hidden md:flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Case ID: {caseData.id.slice(0, 8)}...
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Version {caseData.version}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCompactView(!isCompactView)}
            className="flex items-center space-x-2"
          >
            {isCompactView ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {isCompactView ? 'Full View' : 'Compact View'}
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Primary Content Area */}
        <div className="xl:col-span-3 space-y-6">
          {/* Case Header */}
          <CaseHeader caseData={caseData} 
            // compact={isCompactView} 
        />
          
          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b border-border/50">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto p-1 bg-muted/50 backdrop-blur">
                <TabsTrigger value="overview" className="text-xs md:text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="analysis" className="text-xs md:text-sm">
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="related" className="text-xs md:text-sm">
                  Related
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs md:text-sm">
                  History
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs md:text-sm">
                  Notes
                </TabsTrigger>
                <TabsTrigger value="raw" className="text-xs md:text-sm">
                  Raw Data
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <CaseContent case={caseData} />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
                    {analysisData && (
                      <Badge variant="default" className="text-xs">
                        Analysis Complete
                      </Badge>
                    )}
                  </div>
                  
                  {analysisData ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-foreground">
                        {typeof analysisData.analysis === 'string' 
                          ? <MarkdownPreview content={ analysisData.analysis || '' } />
                          : JSON.stringify(analysisData, null, 2)
                        }
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-center">
                      <div className="space-y-3">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-foreground">No Analysis Available</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Use the AI Analysis tool in the sidebar to generate insights for this case
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="related" className="space-y-6">
              <RelatedCases 
                caseId={caseData.id} 
                onCaseSelect={handleCaseSelect}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <CaseHistory 
                caseId={caseData.id}
                currentVersion={caseData.version}
                onVersionChange={handleVersionChange}
              />
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <CaseNotes caseData={caseData} />
            </TabsContent>

            <TabsContent value="raw" className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Raw Case Data</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(caseData, null, 2))}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Copy JSON
                    </Button>
                  </div>
                  <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-auto max-h-96 text-foreground">
                    {JSON.stringify(caseData, null, 2)}
                  </pre>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <CaseActions 
            caseData={caseData} 
            onAction={handleAction}
          />
        </div>
      </div>

      {/* Quick Access Footer */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-muted-foreground">Quick Actions:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction('analyze')}
              className="h-8 text-xs"
            >
              Analyze
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction('similar')}
              className="h-8 text-xs"
            >
              Find Similar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction('annotations')}
              className="h-8 text-xs"
            >
              Add Note
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Settings className="h-3 w-3" />
            <span>Case Tools</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
