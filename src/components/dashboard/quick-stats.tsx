import { User } from '@/@types/db';
import { 
  BookMarked, 
  BookOpen, 
  ArrowUp,
  Sparkles,
  Clock 
} from 'lucide-react';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

interface QuickStatsProps {
  user: User | null;
}

const QuickStats = ({ user }: QuickStatsProps) => {
  // We would normally fetch these statistics from the backend
  const stats = [
    { 
      name: 'Questions Attempted', 
      value: '42', 
      change: '+5% from last week',
      trend: 'up',
      icon: BookOpen 
    },
    { 
      name: 'Saved Bookmarks', 
      value: '18', 
      change: '3 new bookmarks',
      trend: 'up',
      icon: BookMarked 
    },
    { 
      name: 'AI Insights Used', 
      value: '34', 
      change: '9 this week',
      trend: 'up',
      icon: Sparkles 
    },
    { 
      name: 'Study Streaks', 
      value: '12 days', 
      change: 'Current streak',
      trend: 'up',
      icon: Clock 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground font-medium">{stat.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs flex items-center gap-1">
                    {stat.trend === 'up' && <ArrowUp className="h-3 w-3 text-green-500" />}
                    <span className="text-muted-foreground">{stat.change}</span>
                  </p>
                </div>
              </div>
              <div className={cn(
                "h-full w-2", 
                stat.trend === 'up' ? "bg-green-500" : "bg-amber-500"
              )}></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
