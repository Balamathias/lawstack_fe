"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { BarChart2, TrendingUp } from 'lucide-react';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';

const TrendingTopics = () => {
  // These would normally come from the backend
  const topics = [
    { name: 'Constitutional Law', count: 87, trend: 'up', color: 'bg-blue-500' },
    { name: 'Contract Law', count: 64, trend: 'up', color: 'bg-purple-500' },
    { name: 'Criminal Law', count: 56, trend: 'down', color: 'bg-amber-500' },
    { name: 'Tort Law', count: 49, trend: 'up', color: 'bg-green-500' },
    { name: 'Administrative Law', count: 42, trend: 'down', color: 'bg-red-500' },
  ];
  
  const maxCount = Math.max(...topics.map(t => t.count));
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trending Topics</CardTitle>
            <CardDescription>Most active legal subjects this week</CardDescription>
          </div>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map((topic, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{topic.name}</span>
                <div className="flex items-center gap-1.5">
                  <span>{topic.count} questions</span>
                  <TrendingUp className={cn(
                    'h-3.5 w-3.5',
                    topic.trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'
                  )} />
                </div>
              </div>
              <Progress value={(topic.count / maxCount) * 100} className={cn("h-1.5", `${topic.color.replace('bg-', 'bg-opacity-80 ')}`, "bg-secondary")} />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-center text-muted-foreground">
        Based on question activity and user engagement
      </CardFooter>
    </Card>
  );
};

export default TrendingTopics;
