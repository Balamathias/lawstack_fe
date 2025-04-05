'use client';

import React, { useState } from 'react';
import { SearchResults, Question, Course } from '@/@types/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookOpen, Calendar, School, FileText, BookMarked, ChevronRight, Sparkles, Loader2, Clock, User, ArrowUpRight, GraduationCap, Scale } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { convertMarkdownToPlainText, getSemester, cn } from '@/lib/utils';
import { useRouter } from 'nextjs-toploader/app';

interface SearchResultsDisplayProps {
  results: SearchResults;
  onPageChange: (page: number) => void;
  currentPage: number;
}

export function SearchResultsDisplay({ results, onPageChange, currentPage }: SearchResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();
  
  // Group results by type
  const courseResults = results?.courses || [];
  const questionResults = results?.past_questions || [];
  const resourceResults: any = [];
  
  // Function to render result items based on type
  const renderResultItem = (item: any, index: number, itemType="resources") => {
    
    // Common animation props for all item types
    const motionProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: index * 0.05 },
      exit: { opacity: 0, y: -10 }
    };
    
    if (itemType === 'course') {
      return (
        <motion.div key={item.id} {...motionProps}>
          <CourseResultCard course={item.data} />
        </motion.div>
      );
    }
    
    if (itemType === 'question') {
      return (
        <motion.div key={item.id} {...motionProps}>
          <QuestionResultCard question={item.data} />
        </motion.div>
      );
    }
    
    // Default/resource result type
    // return (
    //   <motion.div key={item.id} {...motionProps}>
    //     <ResourceResultCard resource={item.data} />
    //   </motion.div>
    // );
    return null
  };
  
  const getResultCountByTab = (tab: string) => {
    switch (tab) {
      case 'courses': return courseResults.length;
      case 'questions': return questionResults.length;
      case 'resources': return resourceResults.length;
      default: return results?.past_questions?.length || 0;
    }
  };
  
  
  // Calculate total pages
  const totalPages = Math.ceil(results.count / 15);
  
  // Generate patterns for items
  const getPattern = (name: string = '') => {
    const patterns = [
      'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0/20px 20px',
      'linear-gradient(45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%) 0 0/20px 20px',
      'linear-gradient(0deg, currentColor 2px, transparent 2px) 0 0/24px 24px',
      'radial-gradient(circle at 50% 50%, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%) 0 0/24px 24px',
    ];
    
    // Generate a consistent pattern index based on name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return patterns[hash % patterns.length];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 bg-gradient-to-b from-primary to-primary/30 rounded-full"></div>
          <h2 className="text-lg sm:text-xl font-semibold">Search Results</h2>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {results.count} items
          </Badge>
        </div>
        
        <div className="flex items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-card/70 backdrop-blur-sm border border-border/50 flex gap-4 flex-wrap">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500"
                disabled={courseResults.length === 0}
              >
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Courses
                <Badge className="ml-1.5 bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">
                  {courseResults.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="questions" 
                className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-500"
                disabled={questionResults.length === 0}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Questions
                <Badge className="ml-1.5 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                  {questionResults.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500"
                disabled={resourceResults.length === 0}
              >
                <BookMarked className="h-3.5 w-3.5 mr-1.5" />
                Resources
                <Badge className="ml-1.5 bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">
                  {resourceResults.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-0">
              <AnimatePresence mode="wait">
                {results?.past_questions?.map((item, index) => renderResultItem(item, index, 'questions'))}
              </AnimatePresence>
            </TabsContent>
            
            <TabsContent value="courses" className="space-y-4 mt-0">
              <AnimatePresence mode="wait">
                {courseResults.map((item, index) => renderResultItem(item, index, 'courses'))}
              </AnimatePresence>
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-4 mt-0">
              <AnimatePresence mode="wait">
                {questionResults.map((item, index) => renderResultItem(item, index))}
              </AnimatePresence>
            </TabsContent>
              
            <TabsContent value="resources" className="space-y-4 mt-0">
              <AnimatePresence mode="wait">
                {resourceResults.map((item: any, index: number) => renderResultItem(item, index))}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={currentPage <= 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Display a window of 5 pages around the current page
              let pageNum = currentPage;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(pageNum);
                    }}
                    isActive={pageNum === currentPage}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                className={currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

// Course result card component
function CourseResultCard({ course }: { course: Course }) {
  const pattern = getPattern(course.name);
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-500/30 hover:bg-blue-500/[0.02] group relative">
      {/* Pattern background */}
      <div className="absolute inset-0 pointer-events-none text-blue-500/[0.02] dark:text-blue-500/[0.015]">
        <div className="absolute inset-0 bg-repeat opacity-60" style={{ backgroundImage: pattern }} />
      </div>
      
      {/* Top gradient highlight */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/30 via-blue-500/60 to-blue-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                Course
              </Badge>
              {course.code && (
                <Badge variant="outline" className="bg-card">
                  {course.code}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{course.name}</CardTitle>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500 border border-blue-500/20 transition-transform group-hover:scale-110 duration-300">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="line-clamp-2 mb-4 mt-1">
          {course.description || "No description available for this course."}
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {course.level && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {course.level} Level
            </Badge>
          )}
          
          {course.duration && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.duration} {parseInt(course.duration) > 1 ? 'Years' : 'Year'}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-1 pb-4 flex justify-between items-center border-t border-border/20 mt-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <School className="h-3.5 w-3.5" />
          <span>{course.institution || "Unknown Institution"}</span>
        </div>
        
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
          View Course <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Question result card component
function QuestionResultCard({ question }: { question: Question }) {
  const pattern = getPattern(question.course_name || '');
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] group relative">
      {/* Pattern background */}
      <div className="absolute inset-0 pointer-events-none text-emerald-500/[0.02] dark:text-emerald-500/[0.015]">
        <div className="absolute inset-0 bg-repeat opacity-60" style={{ backgroundImage: pattern }} />
      </div>
      
      {/* Top gradient highlight */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/30 via-emerald-500/60 to-emerald-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                Past Question
              </Badge>
              
              {question.year && (
                <Badge variant="outline" className="bg-card flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {question.year}
                </Badge>
              )}
            </div>
            
            {question.course_name && (
              <CardTitle className="text-xl">{question.course_name}</CardTitle>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500 border border-emerald-500/20 transition-transform group-hover:scale-110 duration-300">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="line-clamp-3 mb-4 mt-1">
          {question.text_plain ? (
            convertMarkdownToPlainText(question.text_plain)
          ) : (
            question.text || "No question text available."
          )}
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {question.semester && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getSemester(question.semester)} Semester
            </Badge>
          )}
          
          {question.level && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {question.level} Level
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-1 pb-4 flex justify-between items-center border-t border-border/20 mt-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {question.created_at && (
            <>
              <Calendar className="h-3.5 w-3.5" />
              <time>{new Date(question.created_at).toLocaleDateString()}</time>
            </>
          )}
        </div>
        
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
          View Question <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Resource result card component
function ResourceResultCard({ resource }: { resource: any }) {
  const pattern = getPattern(resource.title || '');
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-amber-500/30 hover:bg-amber-500/[0.02] group relative">
      {/* Pattern background */}
      <div className="absolute inset-0 pointer-events-none text-amber-500/[0.02] dark:text-amber-500/[0.015]">
        <div className="absolute inset-0 bg-repeat opacity-60" style={{ backgroundImage: pattern }} />
      </div>
      
      {/* Top gradient highlight */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/30 via-amber-500/60 to-amber-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                Resource
              </Badge>
              
              {resource.type && (
                <Badge variant="outline" className="bg-card">
                  {resource.type}
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-xl">{resource.title || "Untitled Resource"}</CardTitle>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500 border border-amber-500/20 transition-transform group-hover:scale-110 duration-300">
              <BookMarked className="h-5 w-5" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="line-clamp-3 mb-4 mt-1">
          {resource.description || "No description available for this resource."}
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {resource.tags && resource.tags.length > 0 && (
            resource.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))
          )}
          
          {resource.tags && resource.tags.length > 3 && (
            <Badge variant="secondary">+{resource.tags.length - 3} more</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-1 pb-4 flex justify-between items-center border-t border-border/20 mt-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {resource.author && (
            <>
              <User className="h-3.5 w-3.5" />
              <span>{resource.author}</span>
            </>
          )}
        </div>
        
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
          View Resource <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to generate patterns for items
function getPattern(name: string = '') {
  const patterns = [
    'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0/20px 20px',
    'linear-gradient(45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%) 0 0/20px 20px',
    'linear-gradient(0deg, currentColor 2px, transparent 2px) 0 0/24px 24px',
    'radial-gradient(circle at 50% 50%, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%) 0 0/24px 24px',
  ];
  
  // Generate a consistent pattern index based on name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return patterns[hash % patterns.length];
}