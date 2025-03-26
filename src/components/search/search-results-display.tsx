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
import { BookOpen, Calendar, School, FileText, BookMarked, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { convertMarkdownToPlainText, getSemester } from '@/lib/utils';
import { useRouter } from 'nextjs-toploader/app';
import { useAnalyzeSearch } from '@/services/client/ai';

interface SearchResultsDisplayProps {
  results: SearchResults;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function SearchResultsDisplay({ results, currentPage, onPageChange }: SearchResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<string>(
    results.past_questions?.length ? 'questions' : 
    results.courses?.length ? 'courses' : 
    'institutions'
  );
  
  // Count total results across all categories
  const totalResults = (
    (results.past_questions?.length || 0) + 
    (results.courses?.length || 0) + 
    (results.institutions?.length || 0)
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {totalResults} Results
        </h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full flex flex-wrap justify-start gap-2 bg-transparent p-0">
          {results.past_questions?.length > 0 && (
            <TabsTrigger 
              value="questions" 
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-primary"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Past Questions</span>
              <span className="inline sm:hidden">Questions</span>
              <Badge variant="secondary" className="ml-0.5 bg-background/80 text-xs">
                {results.past_questions.length}
              </Badge>
            </TabsTrigger>
          )}
          
          {results.courses?.length > 0 && (
            <TabsTrigger 
              value="courses" 
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-primary"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Courses</span>
              <Badge variant="secondary" className="ml-0.5 bg-background/80 text-xs">
                {results.courses.length}
              </Badge>
            </TabsTrigger>
          )}
          
          {results.institutions?.length > 0 && (
            <TabsTrigger 
              value="institutions" 
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-primary"
            >
              <School className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Institutions</span>
              <span className="inline sm:hidden">Schools</span>
              <Badge variant="secondary" className="ml-0.5 bg-background/80 text-xs">
                {results.institutions.length}
              </Badge>
            </TabsTrigger>
          )}
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="questions" className="m-0">
            <motion.div 
              className="grid gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {results.past_questions?.map((question, index) => (
                <QuestionCard key={question.id} question={question} index={index} />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="courses" className="m-0">
            <motion.div 
              className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {results.courses?.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="institutions" className="m-0">
            <motion.div 
              className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {results.institutions?.map((institution, index) => (
                <motion.div
                  key={institution.id}
                  variants={itemVariants}
                  className="bg-card rounded-lg border border-border p-4 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {institution.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{institution.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {institution.courses_count || 0} courses
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {[...Array(5)].map((_, i) => {
            const page = currentPage - 2 + i;
            if (page < 1) return null;
            
            return (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// Question card component
function QuestionCard({ question, index }: { question: Question, index: number }) {
  const router = useRouter();
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  return (
    <motion.div variants={itemVariants} onClick={() => router.push(`/dashboard/past-questions/${question.id}`)}>
      <Card className="overflow-hidden hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold line-clamp-2">{convertMarkdownToPlainText(question.text.split('?')[0])}?</CardTitle>
            <Badge className="ml-2 shrink-0">
              {question.year}
            </Badge>
          </div>
          <CardDescription className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <School className="h-3 w-3" />
              {question.institution_name || 'Unknown Institution'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {question.course_name || 'Unknown Course'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {getSemester(question.semester) || 'Unknown Semester'}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {convertMarkdownToPlainText(question.text)}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/past-questions/${question.id}`}>
                View Question
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              onClick={(e) => {
                e.preventDefault();
                setShowAnalysis(!showAnalysis);
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {showAnalysis ? "Hide Analysis" : "AI Analysis"}
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" title="Bookmark this question">
            <BookMarked className="h-4 w-4" />
          </Button>
        </CardFooter>
        
        {/* Collapsible AI Analysis Section */}
        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0 pb-4 border-t border-border/50 mt-2">
                <QuestionAnalysis questionId={question.id} text={question.text} />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Add a new component for question analysis
function QuestionAnalysis({ questionId, text }: { questionId: string, text: string }) {
  const [analysisRequested, setAnalysisRequested] = useState(false);
  const { data, isLoading, error, refetch } = useAnalyzeSearch(text.substring(0, 200));
  
  const handleAnalyzeClick = async () => {
    setAnalysisRequested(true);
    await refetch();
  };
  
  if (!analysisRequested) {
    return (
      <div className="flex justify-center py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyzeClick}
          className="text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Analyze This Question
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Analyzing question...
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-3">
        <p className="text-xs text-red-500">Error analyzing question. Please try again.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 text-sm">
      <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        AI Analysis
      </h4>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {data?.analysis || "No analysis available"}
      </p>
      
      {data?.relatedTopics && data.relatedTopics.length > 0 && (
        <div className="pt-2 mt-2">
          <p className="text-xs font-medium mb-1">Related Topics:</p>
          <div className="flex flex-wrap gap-1.5">
            {data.relatedTopics.slice(0, 3).map((topic, idx) => (
              <Badge 
                key={idx} 
                variant="outline"
                className="text-xs bg-primary/5 hover:bg-primary/10"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Course card component
function CourseCard({ course, index }: { course: Course, index: number }) {
  const router = useRouter();
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden hover:border-primary/30 hover:shadow-md transition-all h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{course.name}</CardTitle>
          <CardDescription>
            {course.code || 'No course code'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {course.description || 'No description available'}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <School className="h-3 w-3" />
              {course.institution_name || 'Unknown Institution'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {/* {course.total_questions || 0} Past Questions */}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="pt-0 mt-auto">
          <div className="w-full space-y-2">
            <Button variant="outline" size="sm" className="w-full group" asChild>
              <Link href={`/dashboard/courses/${course.id}`} className="flex justify-between items-center">
                <span>View Course</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full flex items-center gap-1 text-xs justify-center"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {showAnalysis ? "Hide AI Insights" : "AI Course Insights"}
            </Button>
          </div>
        </CardFooter>
        
        {/* Collapsible AI Analysis Section */}
        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0 pb-4 border-t border-border/50 mt-2">
                <CourseAnalysis courseId={course.id} name={course.name} description={course.description} />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Add a new component for course analysis
function CourseAnalysis({ courseId, name, description }: { courseId: string, name: string, description: string }) {
  const [analysisRequested, setAnalysisRequested] = useState(false);
  const { data, isLoading, error, refetch } = useAnalyzeSearch(`Course: ${name}. ${description}`);
  
  const handleAnalyzeClick = async () => {
    setAnalysisRequested(true);
    await refetch();
  };
  
  if (!analysisRequested) {
    return (
      <div className="flex justify-center py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyzeClick}
          className="text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Analyze This Course
        </Button>
      </div>
    );
  }
  
  // Loading and result states similar to QuestionAnalysis
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Analyzing course...
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-3">
        <p className="text-xs text-red-500">Error analyzing course. Please try again.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 text-sm">
      <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        AI Course Insights
      </h4>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {data?.analysis || "No analysis available"}
      </p>
      
      {data?.suggestedResources && data.suggestedResources.length > 0 && (
        <div className="pt-2 mt-2">
          <p className="text-xs font-medium mb-1">Suggested Study Materials:</p>
          <ul className="space-y-1">
            {data.suggestedResources.slice(0, 2).map((resource, idx) => (
              <li key={idx} className="text-xs flex items-start gap-1.5">
                <FileText className="h-3 w-3 mt-0.5 text-muted-foreground" />
                <span>{resource}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 