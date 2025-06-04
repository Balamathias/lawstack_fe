'use client';

import { Note } from '@/@types/db';
import { PaginatedStackResponse } from '@/@types/generics';
import React, { use, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Search, 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  Plus,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { convertMarkdownToPlainText } from '@/lib/utils';

interface ListNotesProps {
    getUserNotes: Promise<PaginatedStackResponse<Note[]>>;
}

type SortOption = 'created_at' | 'updated_at' | 'title' | 'author_name';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const ListNotes = (props: ListNotesProps) => {
  const { data: notes, error, count } = use(props.getUserNotes);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const itemsPerPage = 12;

  const uniqueLabels = useMemo(() => {
    if (!notes) return [];
    const labels = notes.map(note => note.label).filter(Boolean);
    return [...new Set(labels)];
  }, [notes]);

  const filteredAndSortedNotes = useMemo(() => {
    if (!notes) return [];
    
    let filtered = notes.filter(note => {
      const matchesSearch = searchQuery === '' || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.author_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLabel = selectedLabel === null || note.label === selectedLabel;
      
      return matchesSearch && matchesLabel;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author_name':
          aValue = a.author_name.toLowerCase();
          bValue = b.author_name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'updated_at':
        default:
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
          break;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [notes, searchQuery, selectedLabel, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedNotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotes = filteredAndSortedNotes.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showPages = 5; // Number of page buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {pages.map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <FileText className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Notes</h3>
        <p className="text-muted-foreground mb-4">There was an error loading your notes. Please try again.</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Loading state
  if (!notes) {
    return (      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-9 bg-muted rounded w-20 animate-pulse"></div>
            <div className="h-9 bg-muted rounded w-20 animate-pulse"></div>
          </div>
        </div>
        
        {/* Search skeleton */}
        <div className="h-9 bg-muted rounded w-full animate-pulse"></div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Notes</h1>
          <p className="text-muted-foreground mt-1">
            {filteredAndSortedNotes.length} of {notes.length} notes
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button size="sm" asChild>
            <Link href="/dashboard/notes/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title, content, or author..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">          {/* Label Filter */}
          <select
            value={selectedLabel || ''}
            onChange={(e) => {
              setSelectedLabel(e.target.value || null);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground"
          >
            <option value="">All Labels</option>
            {uniqueLabels.map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
          
          {/* Sort Options */}
          <select
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-') as [SortOption, SortDirection];
              setSortBy(field);
              setSortDirection(direction);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground"
          >
            <option value="updated_at-desc">Recently Updated</option>
            <option value="created_at-desc">Recently Created</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="author_name-asc">Author A-Z</option>
            <option value="author_name-desc">Author Z-A</option>
          </select>
        </div>
      </div>

      {/* Notes Grid/List */}
      {paginatedNotes.length === 0 ? (        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery || selectedLabel ? 'No matching notes found' : 'No notes yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedLabel 
              ? 'Try adjusting your search criteria or filters.' 
              : 'Create your first note to get started.'}
          </p>
          {!searchQuery && !selectedLabel && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Note
            </Button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {paginatedNotes.map((note) => (            
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className={`
                bg-card rounded-lg border hover:border-primary/20 transition-all duration-200 hover:shadow-md cursor-pointer group
                ${viewMode === 'grid' ? 'p-6' : 'p-4 flex gap-4'}
              `}
            >
              {viewMode === 'grid' ? (
                <>                  
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {note.title}
                    </h3>
                    {note.label && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary shrink-0">
                        <Tag className="h-3 w-3 mr-1" />
                        {note.label}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {convertMarkdownToPlainText(note.content)}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {note.author_name}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(note.updated_at)}
                    </div>
                  </div>
                </>
              ) : (
                <>                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {note.title}
                      </h3>
                      {note.label && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          <Tag className="h-3 w-3 mr-1" />
                          {note.label}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {convertMarkdownToPlainText(note.content)}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {note.author_name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(note.updated_at)}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ListNotes;