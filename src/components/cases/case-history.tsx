'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  History, 
  Clock, 
  User, 
  GitBranch, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { Case } from '@/@types/cases'
import { useCaseHistory, useRollbackCaseVersion } from '@/services/client/cases'
import { formatDistanceToNow } from 'date-fns'

interface CaseHistoryProps {
  caseId: string
  currentVersion: number
  onVersionChange?: (version: number) => void
}

interface VersionEntry {
  id: string
  version: number
  created_at: string
  updated_at: string
  changes?: string[]
  author?: string
}

export function CaseHistory({ caseId, currentVersion, onVersionChange }: CaseHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  
  const { data: historyResponse, isLoading, error } = useCaseHistory(caseId)
  const rollbackVersion = useRollbackCaseVersion()

  const historyData = historyResponse?.data || []

  const handleRollback = async (version: number) => {
    if (version === currentVersion) return
    
    try {
      await rollbackVersion.mutateAsync(caseId)
      onVersionChange?.(version)
    } catch (error) {
      console.error('Error rolling back version:', error)
    }
  }

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-border/50">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
        <div className="flex items-center space-x-2 mb-4">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Version History</h3>
        </div>
        <LoadingSkeleton />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
        <div className="flex items-center space-x-2 mb-4">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Version History</h3>
        </div>
        <div className="flex items-center justify-center py-8 text-center">
          <div className="space-y-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Failed to load version history</p>
          </div>
        </div>
      </Card>
    )
  }

  // Create version entries including current version
  const allVersions: VersionEntry[] = [
    {
      id: caseId,
      version: currentVersion,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      changes: ['Current version'],
      author: 'Current'
    },
    ...historyData.map((version: any, index: number) => ({
      id: version.id,
      version: currentVersion - (index + 1),
      created_at: version.created_at,
      updated_at: version.updated_at,
      changes: version.changes || ['Version update'],
      author: version.author || 'System'
    }))
  ]

  const visibleVersions = isExpanded ? allVersions : allVersions.slice(0, 3)

  return (
    <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Version History</h3>
          <Badge variant="secondary" className="text-xs">
            v{currentVersion}
          </Badge>
        </div>
        {allVersions.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show All ({allVersions.length})
              </>
            )}
          </Button>
        )}
      </div>

      {allVersions.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-center">
          <div className="space-y-2">
            <GitBranch className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No version history available</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleVersions.map((version, index) => (
            <div
              key={version.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                version.version === currentVersion
                  ? 'border-primary/50 bg-primary/5'
                  : selectedVersion === version.version
                  ? 'border-secondary/50 bg-secondary/10'
                  : 'border-border/50 bg-background/30 hover:bg-background/50'
              }`}
              onClick={() => setSelectedVersion(
                selectedVersion === version.version ? null : version.version
              )}
            >
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  version.version === currentVersion
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {version.version === currentVersion ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">v{version.version}</span>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">
                    Version {version.version}
                  </span>
                  {version.version === currentVersion && (
                    <Badge variant="default" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(version.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                  {version.author && (
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{version.author}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {version.version !== currentVersion && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRollback(version.version)
                    }}
                    disabled={rollbackVersion.isPending}
                    className="h-8 px-3 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Version Details */}
      {selectedVersion !== null && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Version {selectedVersion} Details</h4>
            <div className="text-sm text-muted-foreground">
              <p>Changes made in this version:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {visibleVersions
                  .find(v => v.version === selectedVersion)
                  ?.changes?.map((change, idx) => (
                    <li key={idx}>{change}</li>
                  )) || <li>No specific changes recorded</li>
                }
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Information note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium">Version Management</p>
            <p>Restoring a version will create a new version based on the selected historical state. The current version will be preserved in history.</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
