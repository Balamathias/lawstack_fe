import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Course } from '@/@types/db';
import { BookOpen, Building, Clock, GraduationCap, LucideCode, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  // Map level to a color for visual distinction
  const getLevelColor = (level: number | string) => {
    const numLevel = typeof level === 'string' ? parseInt(level) : level;
    switch(numLevel) {
      case 100: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 200: return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 300: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 400: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 500: return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl border-muted/60 hover:border-green-500/50">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-300 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      
      <CardHeader className="pb-2 relative">
        <div className="absolute top-1 right-1">
          <Badge variant="outline" className={`${getLevelColor(course.level)} text-xs font-medium`}>
            {course.level} Level
          </Badge>
        </div>
        
        <div className="text-green-500 mb-2">
          <GraduationCap size={22} />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-green-600 transition-colors">
            {course.name}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center mt-1 gap-1">
            <Building className="h-3.5 w-3.5 inline-block" />
            <span className="line-clamp-1">{course.institution_name}</span>
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 flex-grow">
        <p className="text-muted-foreground line-clamp-2 text-sm">{course.description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{course.questions_count || 0} Questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{course.students_count || 0} Students</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.duration} {course.duration === 1 ? 'Year' : 'Years'}</span>
            </div>
            <div className="flex items-center gap-1">
              <LucideCode className="h-3.5 w-3.5" />
              <span>{course.code}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t border-border/40 bg-muted/20 mt-auto">
        <Link href={`/dashboard/courses/${course.id}`} className="w-full">
          <Button variant="default" className="w-full bg-green-500/90 hover:bg-green-600 text-white">
            View Past Questions
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
