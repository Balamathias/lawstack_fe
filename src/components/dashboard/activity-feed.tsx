"use client";

import { Question } from '@/@types/db';
import { formatDistanceToNow } from 'date-fns';
import { ActivitySquare, Bookmark, ChevronRight, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ActivityFeedProps {
  questions: Question[];
}

const ActivityFeed = ({ questions }: ActivityFeedProps) => {
  const [activeTab, setActiveTab] = useState('recent');
  
  // Sample activities - in a real app you would fetch this data
  const activities = [
    { 
      type: 'question_viewed', 
      title: 'You viewed a question on "Statutory Interpretation"',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      icon: ActivitySquare,
      user: {
        name: 'You',
        avatar: null
      }
    },
    { 
      type: 'bookmark_added', 
      title: 'You bookmarked "Principles of Constitutional Law"',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: Bookmark,
      user: {
        name: 'You',
        avatar: null
      }
    },
    { 
      type: 'ai_insight', 
      title: 'You generated insights on Contract Law',
      time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      icon: Star,
      user: {
        name: 'You',
        avatar: null
      }
    },
    { 
      type: 'comment_added', 
      title: 'Sarah commented on your answer',
      time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      icon: MessageSquare,
      user: {
        name: 'Sarah',
        avatar: '/avatars/sarah.jpg'
      }
    },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Activity</CardTitle>
        <CardDescription>Your recent interactions</CardDescription>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="recent" className="flex-1">Recent Activity</TabsTrigger>
            <TabsTrigger value="questions" className="flex-1">Latest Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex gap-3 pb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar || undefined} />
                  <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.time, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="flex flex-col gap-1 pb-4">
                <Link href={`/dashboard/questions/${question.id}`} className="text-sm hover:text-primary transition-colors">
                  {question.title || question.text.substring(0, 60) + '...'}
                </Link>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {question.course_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full justify-center gap-1" asChild>
          <Link href="/dashboard/activity">
            View All Activity
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityFeed;
