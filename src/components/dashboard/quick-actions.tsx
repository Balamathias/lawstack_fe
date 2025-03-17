import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  ArrowRight, 
  BookOpen, 
  MessageSquare, 
  Search, 
  Sparkles,
  Users,
  BookMarked,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const QuickActions = () => {
  const actions = [
    {
      title: 'Practice Questions',
      description: 'Browse past questions by course',
      icon: BookOpen,
      href: '/dashboard/questions',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'AI Assistant',
      description: 'Get help with legal questions',
      icon: Sparkles,
      href: '/dashboard/assistant',
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Search',
      description: 'Find specific topics or cases',
      icon: Search,
      href: '/dashboard/search',
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      title: 'Community',
      description: 'Connect with other students',
      icon: Users,
      href: '/dashboard/community',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Chat',
      description: 'Start a conversation with AI',
      icon: MessageSquare,
      href: '/dashboard/chat',
      color: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      title: 'Bookmarks',
      description: 'Access your saved items',
      icon: BookMarked,
      href: '/dashboard/bookmarks',
      color: 'bg-red-500/10 text-red-600',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Access key features of LegalX</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {actions.map((action, i) => (
            <Link 
              key={i} 
              href={action.href} 
              className="group block"
            >
              <div className="border rounded-xl p-4 h-full transition-all group-hover:border-primary/20 group-hover:shadow-sm">
                <div className={cn("p-2 rounded-lg w-fit", action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-medium">{action.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                <div className="flex justify-end mt-2 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
