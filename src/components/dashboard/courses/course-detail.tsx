import React from 'react';
import { Course } from '@/@types/db';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Building,
  Calendar,
  GraduationCap,
  Users,
  Clock,
  BookCopy,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CourseDetailProps {
  course: Course;
}

const CourseDetail = ({ course }: CourseDetailProps) => {
  // Map level to a color for visual distinction
  const getLevelColor = (level: number | string) => {
    const numLevel = typeof level === 'string' ? parseInt(level) : level;
    switch(numLevel) {
      case 100: return 'bg-emerald-500';
      case 200: return 'bg-teal-500';
      case 300: return 'bg-blue-500';
      case 400: return 'bg-purple-500';
      case 500: return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link 
        href="/dashboard/courses" 
        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to All Courses
      </Link>

      {/* Course header */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-90" />
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0">
            <div className={cn(
              "w-32 h-32 rounded-full opacity-20 -mr-16 -mt-16",
              getLevelColor(course.level)
            )}></div>
          </div>
          <div className="absolute bottom-0 left-0">
            <div className={cn(
              "w-64 h-64 rounded-full opacity-10 -ml-32 -mb-32",
              getLevelColor(course.level)
            )}></div>
          </div>
        </div>
        
        <div className="relative z-10 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm h-16 w-16 flex items-center justify-center">
              <GraduationCap size={32} className="text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white">
                  {course.level} Level
                </Badge>
                {course?.is_active ? (
                  <Badge className="bg-green-500 text-white">Active</Badge>
                ) : (
                  <Badge className="bg-amber-500 text-white">Inactive</Badge>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold">{course.name}</h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-white/80">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{course.institution_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookCopy className="h-4 w-4" />
                  <span>{course.code}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <BookOpen className="h-8 w-8 text-green-500 mb-1" />
            <p className="text-2xl font-bold">{course.questions_count || 0}</p>
            <p className="text-muted-foreground text-sm">Past Questions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Users className="h-8 w-8 text-blue-500 mb-1" />
            <p className="text-2xl font-bold">{course.students_count || 0}</p>
            <p className="text-muted-foreground text-sm">Students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Clock className="h-8 w-8 text-purple-500 mb-1" />
            <p className="text-2xl font-bold">{course.duration}</p>
            <p className="text-muted-foreground text-sm">Years</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Calendar className="h-8 w-8 text-amber-500 mb-1" />
            <p className="text-2xl font-bold">
              {new Date(course.updated_at).getFullYear()}
            </p>
            <p className="text-muted-foreground text-sm">Last Updated</p>
          </CardContent>
        </Card>
      </div>

      {/* Course description */}
      {course.description && (
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-2">Course Description</h2>
            <p className="text-muted-foreground">{course.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseDetail;
