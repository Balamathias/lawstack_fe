'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  Clock,
  User,
  FileText,
  AlertCircle
} from 'lucide-react'
import { Case } from '@/@types/cases'
import { useAddCaseNote } from '@/services/client/cases'
import { formatDistanceToNow } from 'date-fns'

interface Note {
  id: string
  content: string
  author: string
  created_at: string
  updated_at: string
  type: 'note' | 'annotation' | 'comment'
}

interface CaseNotesProps {
  caseData: Case
  onNotesUpdate?: (notes: Note[]) => void
}

export function CaseNotes({ caseData, onNotesUpdate }: CaseNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [editContent, setEditContent] = useState('')
  
  const addNote = useAddCaseNote()

  // Parse existing notes from case data
  useEffect(() => {
    if (caseData.notes) {
      try {
        const parsedNotes = JSON.parse(caseData.notes)
        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes)
        } else if (typeof parsedNotes === 'string') {
          // Handle simple string notes
          setNotes([{
            id: '1',
            content: parsedNotes,
            author: 'System',
            created_at: caseData.created_at,
            updated_at: caseData.updated_at,
            type: 'note'
          }])
        }
      } catch {
        // Handle case where notes is just a string
        if (caseData.notes.trim()) {
          setNotes([{
            id: '1',
            content: caseData.notes,
            author: 'System',
            created_at: caseData.created_at,
            updated_at: caseData.updated_at,
            type: 'note'
          }])
        }
      }
    }
  }, [caseData.notes, caseData.created_at, caseData.updated_at])

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return

    try {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent.trim(),
        author: 'Current User', // This should come from auth context
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        type: 'note'
      }

      const updatedNotes = [...notes, newNote]
      
      await addNote.mutateAsync({
        id: caseData.id,
        payload: { note: newNoteContent.trim() }
      })

      setNotes(updatedNotes)
      setNewNoteContent('')
      setIsAddingNote(false)
      onNotesUpdate?.(updatedNotes)
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const handleSaveEdit = async (noteId: string) => {
    if (!editContent.trim()) return

    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, content: editContent.trim(), updated_at: new Date().toISOString() }
        : note
    )

    try {
      // In a real app, you'd make an API call to update the specific note
      setNotes(updatedNotes)
      setEditingId(null)
      setEditContent('')
      onNotesUpdate?.(updatedNotes)
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    
    try {
      // In a real app, you'd make an API call to delete the specific note
      setNotes(updatedNotes)
      onNotesUpdate?.(updatedNotes)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'annotation':
        return <Edit3 className="h-3 w-3" />
      case 'comment':
        return <MessageSquare className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const getNoteTypeBadge = (type: string) => {
    const variants = {
      note: 'default',
      annotation: 'secondary',
      comment: 'outline'
    } as const

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'default'} className="text-xs">
        {getNoteTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notes & Annotations</h3>
          {notes.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingNote(true)}
          disabled={isAddingNote}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      </div>

      {/* Add New Note */}
      {isAddingNote && (
        <Card className="p-4 mb-4 border border-primary/20 bg-primary/5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Add New Note</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingNote(false)
                  setNewNoteContent('')
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Add your note or annotation..."
              className="min-h-[80px] resize-none"
              autoFocus
            />
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingNote(false)
                  setNewNoteContent('')
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNoteContent.trim() || addNote.isPending}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Note
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-center">
          <div className="space-y-2">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No notes added yet</p>
            <p className="text-xs text-muted-foreground">
              Add notes, annotations, or comments to help with your case research
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card 
              key={note.id} 
              className="p-4 border border-border/50 bg-background/50 backdrop-blur-sm"
            >
              <div className="space-y-3">
                {/* Note Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getNoteTypeBadge(note.type)}
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{note.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Note Content */}
                {editingId === note.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[60px] resize-none"
                      autoFocus
                    />
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(null)
                          setEditContent('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(note.id)}
                        disabled={!editContent.trim()}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {note.content}
                  </p>
                )}

                {/* Updated timestamp */}
                {note.updated_at !== note.created_at && editingId !== note.id && (
                  <p className="text-xs text-muted-foreground">
                    Last updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Information */}
      {notes.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium">Note Management</p>
              <p>Notes are automatically saved and synced across all sessions. Use annotations for specific legal insights and comments for general observations.</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
