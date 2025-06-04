'use client';

import React, { useState } from 'react';
import { Note } from '@/@types/db';
import { StackResponse } from '@/@types/generics';
import { Button } from '@/components/ui/button';
import MarkdownPreview from '@/components/markdown-preview';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Edit3,
  Share2,
  Trash2,
  Copy,
  Check,
  FileText,
  Clock,
  Bookmark,
  MoreVertical,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DynamicModal from '@/components/dynamic-modal';
import { useDeleteNote } from '@/services/client/notes';

interface NoteDetailProps {
  getNoteData: Promise<StackResponse<Note | null>>;
  noteId: string;
}

const NoteDetail = ({ getNoteData, noteId }: NoteDetailProps) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const noteResponse = React.use(getNoteData);
  const note = noteResponse.data;

  // Setup delete mutation
  const { mutate: deleteNote, isPending: isDeletingNote } = useDeleteNote();
  const handleCopyUrl = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };
  // Handle note deletion
  const handleDeleteNote = () => {
    if (!note) return;
    
    deleteNote(note.id, {
      onSuccess: (response) => {
        if (response.status === 204) {
          toast.success('Note deleted successfully');
          setDeleteModalOpen(false);
          router.push('/dashboard/notes');
        } else {
          toast.error('Failed to delete note');
        }
      },
      onError: (error) => {
        toast.error(`Error deleting note: ${error.message || 'Something went wrong'}`);
      },
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  // Format full date
  const formatFullDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString));
    } catch {
      return 'Unknown date';
    }
  };

  // Error state
  if (noteResponse.error || !note) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard/notes">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Notes
              </Button>
            </Link>
          </div>

          {/* Error Content */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-6">
              <FileText className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Note Not Found</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              {noteResponse.message || 'The note you are looking for does not exist or you do not have permission to view it.'}
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard/notes">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Notes
                </Button>
              </Link>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Link href="/dashboard/notes">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
              Back to Notes
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyUrl}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2" asChild>
                  <Link href={`/dashboard/notes/${note.id}/edit`}>
                    <Edit3 className="h-4 w-4" />
                    Edit Note
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={handleCopyUrl}>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="gap-2 text-destructive focus:text-destructive"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Note Content */}
        <div className="bg-card rounded-lg border shadow-sm">
          {/* Note Header */}
          <div className="p-6 lg:p-8 border-b">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground leading-tight mb-4">
                  {note.title}
                </h1>
                
                {note.label && (
                  <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                    <Tag className="h-4 w-4 mr-2" />
                    {note.label}
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4 shrink-0" />
                <div>
                  <div className="font-medium text-card-foreground">{note.author_name}</div>
                  {/* <div>Author</div> */}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <div>
                  <div className="font-medium text-card-foreground">
                    {formatDate(note.created_at)}
                  </div>
                  {/* <div>Created</div> */}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <div>
                  <div className="font-medium text-card-foreground">
                    {formatDate(note.updated_at)}
                  </div>
                  {/* <div>Last updated</div> */}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 shrink-0" />
                <div>
                  <div className="font-medium text-card-foreground">
                    {note.content.length.toLocaleString()} chars
                  </div>
                  {/* <div>Content length</div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Note Content */}
          <div className="p-6 lg:p-8">
            <div className="prose-container">
              <MarkdownPreview 
                content={note.content}
                className="text-base leading-relaxed"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 lg:px-8 py-4 border-t bg-muted/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center gap-4">
                <span>Created: {formatFullDate(note.created_at)}</span>
                <span className="hidden sm:inline">•</span>
                <span>Updated: {formatFullDate(note.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button className="flex-1 sm:flex-none gap-2" asChild>
            <Link href={`/dashboard/notes/${note.id}/edit`}>
              <Edit3 className="h-4 w-4" />
              Edit Note
            </Link>
          </Button>
          
          <Button variant="outline" className="flex-1 sm:flex-none gap-2">
            <Bookmark className="h-4 w-4" />
            Add to Favorites
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none gap-2" 
            onClick={handleCopyUrl}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied!
              </>            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        <DynamicModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          title="Delete Note"
          dismissible={!isDeletingNote}
        >
          <div className="space-y-4">
            {/* Warning Icon */}
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>

            {/* Confirmation Text */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Are you sure you want to delete this note?
              </h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. The note will be permanently deleted from your account.
              </p>
            </div>

            {/* Note Preview */}
            <div className="p-3 bg-muted/30 rounded-lg border">
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{note.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {note.content.slice(0, 100)}
                    {note.content.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Created {formatDate(note.created_at)}</span>
                    <span>•</span>
                    <span>{note.content.length} chars</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeletingNote}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteNote}
                disabled={isDeletingNote}
                className="flex-1 gap-2"
              >
                {isDeletingNote ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Note
                  </>
                )}
              </Button>
            </div>
          </div>
        </DynamicModal>
      </div>
    </div>
  )
}

export default NoteDetail;
