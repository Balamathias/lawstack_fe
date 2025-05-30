'use client'

import React, { useState } from 'react'
import { Case } from '@/@types/cases'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MarkdownPreview from '@/components/markdown-preview'
import { 
  FileTextIcon, 
  ScaleIcon, 
  BookOpenIcon, 
  LightbulbIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PinIcon
} from 'lucide-react'

interface CaseContentProps {
  case: Case
}

const CaseContent: React.FC<CaseContentProps> = ({ case: caseData }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const sections = [
    {
      id: 'summary',
      title: 'Case Summary',
      icon: FileTextIcon,
      content: caseData?.summary,
      description: 'Overview of the case and key points'
    },
    {
      id: 'facts',
      title: 'Facts',
      icon: BookOpenIcon,
      content: caseData?.facts,
      description: 'Factual background and circumstances'
    },
    {
      id: 'issues',
      title: 'Legal Issues',
      icon: ScaleIcon,
      content: caseData?.issues,
      description: 'Key legal questions and matters'
    },
    {
      id: 'holding',
      title: 'Holding & Reasoning',
      icon: LightbulbIcon,
      content: caseData?.holding,
      description: 'Court\'s decision and legal reasoning'
    }
  ]

  const availableSections = sections.filter(section => section.content)

  if (availableSections.length === 0) {
    return (
      <Card className="glass-effect border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <FileTextIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">No content available</h3>
              <p className="text-muted-foreground">Case content has not been added yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabbed View for larger screens */}
      <div className="hidden lg:block">
        <Tabs defaultValue={availableSections[0]?.id} className="w-full">
          <TabsList className="glass-effect border-border/50 w-full justify-start h-auto p-1">
            {availableSections.map((section) => {
              const Icon = section.icon
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Icon className="w-4 h-4" />
                  {section.title}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {availableSections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-6">
              <Card className="glass-effect border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {section.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="backdrop-blur-sm">
                      {section.content?.length || 0} chars
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose-sm max-w-none">
                    <MarkdownPreview content={section.content || ''} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Accordion View for smaller screens */}
      <div className="lg:hidden space-y-4">
        {availableSections.map((section) => {
          const Icon = section.icon
          const isExpanded = expandedSections.has(section.id)

          return (
            <Card key={section.id} className="glass-effect border-border/50">
              <CardHeader className="pb-3">
                <Button
                  variant="ghost"
                  onClick={() => toggleSection(section.id)}
                  className="w-full justify-between p-0 h-auto hover:bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {section.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="backdrop-blur-sm text-xs">
                      {section.content?.length || 0}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </Button>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 animate-fade-in">
                  <div className="prose-sm max-w-none">
                    <MarkdownPreview content={section.content || ''} />
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Quick Navigation */}
      {availableSections.length > 1 && (
        <Card className="glass-effect border-border/50 lg:hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <PinIcon className="w-4 h-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedSections(new Set(availableSections.map(s => s.id)))}
                className="text-xs backdrop-blur-sm"
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedSections(new Set())}
                className="text-xs backdrop-blur-sm"
              >
                Collapse All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CaseContent
