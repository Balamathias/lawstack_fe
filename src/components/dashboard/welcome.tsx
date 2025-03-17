import { User } from '@/@types/db';
import { format } from 'date-fns';
import { Bell, Search } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

interface WelcomeProps {
  user: User | null;
}

const DashboardWelcome = ({ user }: WelcomeProps) => {
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get day name and date
  const today = format(new Date(), 'EEEE, MMMM do');

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-green-600/90 dark:from-green-600/90 dark:to-green-700/90" />
      
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>
      
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 space-y-4 md:space-y-0">
          <div className="text-white z-10">
            <p className="text-white/80 font-medium">{today}</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              {getGreeting()}, {user?.first_name || user?.username || 'Student'}
            </h1>
            <p className="mt-1 text-white/80">
              Ready to continue your legal learning journey?
            </p>
          </div>
          
          <div className="z-10 w-full md:w-auto">
            <div className="relative md:min-w-[260px] w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
              <Input 
                placeholder="Search questions, topics..." 
                className="pl-9 bg-white/20 border-white/20 focus:bg-white/30 placeholder:text-white/70 text-white w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardWelcome;
