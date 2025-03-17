import React from 'react';
import { getUser } from '@/services/server/auth';
import { Metadata } from 'next';
import { getCourses } from '@/services/server/courses';
import { getRecentQuestions } from '@/services/server/questions';
import DashboardWelcome from '@/components/dashboard/welcome';
import ActivityFeed from '@/components/dashboard/activity-feed';
import QuickActions from '@/components/dashboard/quick-actions';
import ExploreCourses from '@/components/dashboard/explore-courses';
import QuickStats from '@/components/dashboard/quick-stats';
import TrendingTopics from '@/components/dashboard/trending-topics';

export const metadata: Metadata = {
  title: 'Dashboard | LegalX',
  description: 'Your legal learning dashboard',
};

export default async function Dashboard() {
  const { data: user } = await getUser();
  const { data: courses } = await getCourses();
  const { data: recentQuestions } = await getRecentQuestions({ params: { limit: 5 }});

  return (
    <div className="container py-6 max-w-7xl mx-auto space-y-8 max-lg:mt-14 px-4 pb-20">
      {/* Welcome Section */}
      <DashboardWelcome user={user} />
      
      {/* Quick Stats */}
      <QuickStats user={user} />
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Explore Courses */}
          <ExploreCourses courses={courses || []} />
          
          {/* Trending Topics */}
          <TrendingTopics />
        </div>
        
        {/* Sidebar - Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <ActivityFeed questions={recentQuestions || []} />
        </div>
      </div>
    </div>
  );
}