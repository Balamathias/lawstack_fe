import React, { useState } from 'react'
import { Question } from '@/@types/db'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import DeleteQuestionDialog from './delete-question-dialog'

interface QuestionRowProps {
  question: Question
  onDelete: (id: string) => void
  isDeleting: boolean
}

const QuestionRow = ({ question, onDelete, isDeleting }: QuestionRowProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getQuestionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mcq':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'essay':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'short answer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'practical':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  return (
    <>
      <div className="p-4 hover:bg-muted/20 transition-colors group">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h3 className="font-medium text-base line-clamp-2">{question.text}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-secondary/20">
                  {question.course_name || question.course}
                </Badge>
                <Badge variant="outline" className="bg-secondary/20">
                  {question.year}
                </Badge>
                <Badge variant="outline" className="bg-secondary/20">
                  {`${question.level} Level`}
                </Badge>
                <Badge className={getQuestionTypeColor(question.type)}>
                  {question.type}
                </Badge>
              </div>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex gap-2 items-start opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`/admin/questions/${question.id}/view`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
              <Link href={`/admin/questions/${question.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/questions/${question.id}/view`} className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/questions/${question.id}/edit`} className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground mt-1">
            <p>{question.institution_name || question.institution}</p>
            <p>{question.semester}</p>
            {question.session && <p>Session: {question.session}</p>}
            <p>Marks: {question.marks}</p>
          </div>

          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {question.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-secondary/30 rounded-full">
                  {truncateText(tag, 15)}
                </span>
              ))}
              {question.tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 bg-secondary/30 rounded-full">
                  +{question.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteQuestionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onDelete={() => {
          onDelete(question.id)
          setShowDeleteDialog(false)
        }}
        questionText={question.text}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default QuestionRow
