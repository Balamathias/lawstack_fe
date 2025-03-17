"use client";

import React, { useState } from 'react';
import { Course } from '@/@types/db';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, ChevronRight, School, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ExploreCoursesProps {
  courses: Course[];
}

const CourseCard = ({ course }: { course: Course }) => (
  <Card className="min-w-[260px] max-w-[320px] hover:shadow-md transition-shadow flex flex-col h-full">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className={cn(
          "p-2 rounded-md",
          course.is_active ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
        )}>
          <School className="h-5 w-5" />
        </div>
      </div>
      <CardTitle className="line-clamp-2 text-base mt-2">{course.name}</CardTitle>
      <CardDescription className="line-clamp-1">{course.institution_name}</CardDescription>
    </CardHeader>
    <CardContent className="pb-4 flex-grow">
      <div className="flex items-center text-sm text-muted-foreground gap-4">
        <div className="flex items-center gap-1 text-sm">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{course.questions_count || 0} Questions</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Timer className="h-3.5 w-3.5" />
          <span>Updated {new Date(course.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className="pt-0 pb-4">
      <Link href={`/dashboard/courses/${course.id}`} className="w-full">
        <Button variant="outline" className="w-full justify-between">
          View Course
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

const ExploreCourses = ({ courses }: ExploreCoursesProps) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Group courses by some category for tabs
  const recentCourses = courses.slice(0, 10);
  const popularCourses = [...courses].sort((a, b) => 
    (b.questions_count || 0) - (a.questions_count || 0)
  ).slice(0, 10);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Explore Courses</CardTitle>
            <CardDescription>Discover and browse available courses</CardDescription>
          </div>
          <Link href="/dashboard/courses">
            <Button variant="outline" size="sm" className="gap-1 ml-auto">
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="recent">Recently Updated</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {courses.length > 0 ? (
              <ScrollArea className="pb-4">
                <div className="flex space-x-4">
                  {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No courses found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            <ScrollArea className="pb-4">
              <div className="flex space-x-4">
                {recentCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="popular">
            <ScrollArea className="pb-4">
              <div className="flex space-x-4">
                {popularCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExploreCourses;
