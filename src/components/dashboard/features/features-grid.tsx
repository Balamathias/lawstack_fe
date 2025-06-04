'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Search, 
  BookMarked, 
  Settings, 
  Users,
  Sparkles,
  Shield,
  Scale,
  Notebook,
  Crown,
  FileQuestion,
  BrainCircuit,
  MessageSquare,
  Calendar,
  Trophy,
  Target,
  Zap,
  Star,
  ChevronRight,
  ArrowUpRight,
  Filter,
  Grid3X3,
  List,
  CheckCircle2,
  TrendingUp,
  Brain,
  Rocket,
  Award,
  ShieldCheck,
  Globe,
  BarChart3,
  BookOpenCheck,
  GraduationCap,
  FileText,
  MessageCircle,
  Briefcase,
  Library
} from "lucide-react";
import { cn } from '@/lib/utils';
import { User } from '@/@types/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Enhanced feature definitions with categories and additional features
const allFeatures = [
  // Core Features
  {
    id: 'home',
    title: 'Dashboard Home',
    description: 'Your personalized learning hub with insights and progress tracking.',
    icon: Home,
    href: '/dashboard',
    category: 'Core',
    color: 'bg-slate-500/10 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-slate-600/20 hover:to-slate-400/20',
    pattern: 'radial-gradient(circle at center, currentColor 0, currentColor 1px, transparent 1px, transparent) 0 0/24px 24px',
    patternColor: 'text-slate-500/[0.03] dark:text-slate-400/[0.03]',
    featured: false,
    popularity: 95,
    tags: ['overview', 'dashboard', 'analytics'],
    stats: {
      count: 'Central',
      label: 'Hub'
    }
  },
  {
    id: 'smart-assistant',
    title: 'Smart AI Assistant',
    description: 'Chat with LawStack AI for personalized legal assistance and guidance.',
    icon: Sparkles,
    href: '/dashboard/chat',
    category: 'AI-Powered',
    color: 'bg-violet-500/10 text-violet-500 dark:bg-violet-500/20 dark:text-violet-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-violet-600/20 hover:to-violet-400/20',
    pattern: 'radial-gradient(circle at center, currentColor 0, currentColor 1px, transparent 1px, transparent) 0 0/24px 24px',
    patternColor: 'text-violet-500/[0.03] dark:text-violet-400/[0.03]',
    featured: true,
    badge: 'AI',
    popularity: 90,
    tags: ['ai', 'chat', 'assistance', 'smart'],
    stats: {
      count: 'AI',
      label: 'Powered'
    }
  },
  {
    id: 'courses',
    title: 'Course Explorer',
    description: 'Discover comprehensive Nigerian law courses and study materials.',
    icon: BookOpen,
    href: '/dashboard/courses',
    category: 'Learning',
    color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-blue-400/20',
    pattern: 'radial-gradient(circle, transparent 20%, currentColor 20%, currentColor 21%, transparent 21%, transparent) 0 0/30px 30px',
    patternColor: 'text-blue-500/[0.03] dark:text-blue-400/[0.03]',
    featured: true,
    popularity: 88,
    tags: ['courses', 'learning', 'curriculum', 'study'],
    stats: {
      count: '200+',
      label: 'Courses'
    }
  },
  {
    id: 'quizzes',
    title: 'Smart Quizzes',
    description: 'Test your knowledge with AI-powered adaptive quiz system.',
    icon: BrainCircuit,
    href: '/dashboard/quizzes',
    category: 'Assessment',
    color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-amber-600/20 hover:to-amber-400/20',
    pattern: 'linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor) 0 0/20px 20px',
    patternColor: 'text-amber-500/[0.03] dark:text-amber-400/[0.03]',
    featured: false,
    badge: 'CBT',
    popularity: 85,
    tags: ['quiz', 'test', 'assessment', 'practice'],
    stats: {
      count: 'Smart',
      label: 'CBT'
    }
  },
  
  // Research & Resources
  {
    id: 'past-questions',
    title: 'Past Questions Bank',
    description: 'Access comprehensive collection of previous examination questions.',
    icon: FileQuestion,
    href: '/dashboard/past-questions',
    category: 'Resources',
    color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-emerald-600/20 hover:to-emerald-400/20',
    pattern: 'linear-gradient(0deg, currentColor 2px, transparent 2px) 0 0/24px 24px, linear-gradient(90deg, currentColor 2px, transparent 2px) 0 0/24px 24px',
    patternColor: 'text-emerald-500/[0.03] dark:text-emerald-400/[0.03]',
    featured: false,
    popularity: 80,
    tags: ['questions', 'exam', 'practice', 'history'],
    stats: {
      count: '5000+',
      label: 'Questions'
    }
  },
  {
    id: 'cases',
    title: 'Legal Cases Database',
    description: 'Explore landmark legal cases and judicial decisions with AI analysis.',
    icon: Scale,
    href: '/dashboard/cases',
    category: 'Research',
    color: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-indigo-600/20 hover:to-indigo-400/20',
    pattern: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 12px)',
    patternColor: 'text-indigo-500/[0.03] dark:text-indigo-400/[0.03]',
    featured: true,
    popularity: 75,
    tags: ['cases', 'law', 'judgments', 'precedents'],
    stats: {
      count: '1000+',
      label: 'Cases'
    }
  },
  {
    id: 'search',
    title: 'Global Search',
    description: 'Find specific content across all resources with intelligent search.',
    icon: Search,
    href: '/dashboard/search',
    category: 'Tools',
    color: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20 dark:text-teal-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-teal-600/20 hover:to-teal-400/20',
    pattern: 'linear-gradient(45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%), linear-gradient(-45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%) 0 0/20px 20px',
    patternColor: 'text-teal-500/[0.03] dark:text-teal-400/[0.03]',
    featured: false,
    popularity: 70,
    tags: ['search', 'find', 'discovery', 'content'],
    stats: {
      count: 'All',
      label: 'Resources'
    }
  },
  
  // Personal Management
  {
    id: 'bookmarks',
    title: 'Bookmarks Manager',
    description: 'Save and organize your important study materials and resources.',
    icon: BookMarked,
    href: '/dashboard/bookmarks',
    category: 'Personal',
    color: 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-pink-600/20 hover:to-pink-400/20',
    pattern: 'radial-gradient(circle at 50% 50%, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%) 0 0/30px 30px',
    patternColor: 'text-pink-500/[0.03] dark:text-pink-400/[0.03]',
    featured: false,
    popularity: 65,
    tags: ['bookmarks', 'saved', 'favorites', 'collection'],
    stats: {
      count: 'Personal',
      label: 'Collection'
    }
  },
  {
    id: 'notes',
    title: 'Smart Notes',
    description: 'Create, edit, and organize your study notes with rich formatting.',
    icon: Notebook,
    href: '/dashboard/notes',
    category: 'Personal',
    color: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-orange-600/20 hover:to-orange-400/20',
    pattern: 'repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)',
    patternColor: 'text-orange-500/[0.03] dark:text-orange-400/[0.03]',
    featured: false,
    popularity: 60,
    tags: ['notes', 'writing', 'organization', 'study'],
    stats: {
      count: 'Rich',
      label: 'Editor'
    }
  },
  
  // System & Settings
  {
    id: 'settings',
    title: 'Settings & Preferences',
    description: 'Customize your learning experience and manage account settings.',
    icon: Settings,
    href: '/dashboard/settings',
    category: 'System',
    color: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-gray-600/20 hover:to-gray-400/20',
    pattern: 'conic-gradient(from 0deg at 50% 50%, currentColor 0deg, transparent 90deg, transparent 270deg, currentColor 360deg)',
    patternColor: 'text-gray-500/[0.03] dark:text-gray-400/[0.03]',
    featured: false,
    popularity: 45,
    tags: ['settings', 'preferences', 'customization', 'account'],
    stats: {
      count: 'Full',
      label: 'Control'
    }
  },
  {
    id: 'subscriptions',
    title: 'Subscription Management',
    description: 'Manage your premium plans and billing information.',
    icon: Crown,
    href: '/dashboard/subscriptions',
    category: 'System',
    color: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-yellow-600/20 hover:to-yellow-400/20',
    pattern: 'radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px), radial-gradient(circle at 75% 75%, currentColor 2px, transparent 2px)',
    patternColor: 'text-yellow-500/[0.03] dark:text-yellow-400/[0.03]',
    featured: false,
    badge: 'Premium',
    popularity: 40,
    tags: ['subscription', 'premium', 'billing', 'plans'],
    stats: {
      count: 'Premium',
      label: 'Plans'
    }
  },
  {
    id: 'community',
    title: 'Community Hub',
    description: 'Connect with fellow law students and share knowledge.',
    icon: Users,
    href: '/dashboard/community',
    category: 'Social',
    color: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400',
    hoverGradient: 'hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-purple-400/20',
    pattern: 'repeating-conic-gradient(from 0deg at 50% 50%, currentColor 0deg 15deg, transparent 15deg 45deg)',
    patternColor: 'text-purple-500/[0.03] dark:text-purple-400/[0.03]',
    featured: false,
    badge: 'Coming Soon',
    popularity: 35,
    tags: ['community', 'social', 'collaboration', 'network'],
    stats: {
      count: 'Connect',
      label: 'Network'
    }
  }
];

const categories = [
  { id: 'all', name: 'All Features', icon: Grid3X3 },
  { id: 'Core', name: 'Core Features', icon: Home },
  { id: 'AI-Powered', name: 'AI-Powered', icon: Brain },
  { id: 'Learning', name: 'Learning', icon: BookOpen },
  { id: 'Assessment', name: 'Assessment', icon: Trophy },
  { id: 'Research', name: 'Research', icon: Search },
  { id: 'Resources', name: 'Resources', icon: Library },
  { id: 'Personal', name: 'Personal', icon: Star },
  { id: 'Tools', name: 'Tools', icon: Zap },
  { id: 'Social', name: 'Social', icon: Users },
  { id: 'System', name: 'System', icon: Settings }
];

interface FeaturesGridProps {
  user: User | null;
  searchParams: Record<string, any>;
}

const FeaturesGrid = ({ user, searchParams }: FeaturesGridProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'popularity' | 'category'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter and sort features
  const filteredFeatures = allFeatures
    .filter(feature => {
      const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return b.popularity - a.popularity;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20
      } 
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      } 
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="show"
        className="relative"
      >
        {/* Background Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-500/5 rounded-full filter blur-3xl opacity-40"></div>
        
        <div className="relative z-10 text-center space-y-4 py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            All LawStack Features
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Everything You Need for
            <span className="block bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
              Legal Excellence
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Discover the complete suite of powerful tools and features designed to accelerate your legal education journey. 
            From AI-powered assistance to comprehensive study resources.
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center gap-8 pt-6"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{allFeatures.length}</div>
              <div className="text-sm text-muted-foreground">Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{categories.length - 1}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{allFeatures.filter(f => f.featured).length}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-card/50 backdrop-blur-sm rounded-2xl border p-6 space-y-6"
      >
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "gap-2 transition-all",
                selectedCategory === category.id && "shadow-md"
              )}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Sort and View Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: 'name' | 'popularity' | 'category') => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredFeatures.length} of {allFeatures.length} features
          </div>
        </div>
      </motion.div>

      {/* Features Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${searchQuery}-${sortBy}-${viewMode}`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
          className={cn(
            "gap-6",
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "flex flex-col space-y-4"
          )}
        >
          {filteredFeatures.map((feature, index) => {
            const isCurrentPath = pathname === feature.href;
            const isHovered = hoveredIndex === index;
            
            return viewMode === 'grid' ? (
              // Grid View
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative overflow-hidden rounded-xl cursor-pointer border transition-all duration-300',
                  'bg-card/80 dark:bg-card/40 backdrop-blur-sm',
                  isCurrentPath ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/10' : 'border-border/60 hover:border-primary/30',
                  feature.hoverGradient,
                  'hover:shadow-xl hover:shadow-primary/10'
                )}
                onClick={() => router.push(feature.href)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Feature badges */}
                {feature.featured && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium z-20 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>Featured</span>
                  </div>
                )}
                
                {feature.badge && !feature.featured && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium z-20">
                    {feature.badge}
                  </div>
                )}

                {/* Background pattern */}
                <div className={cn(
                  "absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300",
                  feature.patternColor,
                  isHovered || isCurrentPath ? 'opacity-60' : 'opacity-40'
                )}>
                  <div 
                    className="absolute inset-0 bg-repeat opacity-30" 
                    style={{ backgroundImage: feature.pattern }}
                  />
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-16 h-16 rotate-45 bg-primary/5 rounded-lg opacity-50" />
                <div className="absolute -bottom-8 -left-8 w-20 h-20 rotate-12 bg-primary/5 rounded-full opacity-30" />

                {/* Current indicator */}
                {isCurrentPath && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Current</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 relative z-10 h-full flex flex-col">
                  {/* Icon and category */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                      'bg-gradient-to-br from-primary/20 to-primary/5 text-primary',
                      (isHovered || isCurrentPath) && "scale-110 shadow-lg"
                    )}>
                      <motion.div
                        animate={{ 
                          rotate: isHovered ? [0, 10, 0] : 0,
                          scale: isHovered ? 1.1 : 1
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <feature.icon className="h-6 w-6 relative z-10" />
                      </motion.div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {feature.category}
                    </Badge>
                  </div>

                  {/* Title and description */}
                  <div className="space-y-2 flex-1">
                    <h3 className={cn(
                      "font-semibold text-lg transition-colors duration-300",
                      (isHovered || isCurrentPath) ? "text-primary" : "text-foreground"
                    )}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Stats and popularity */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-primary">{feature.stats.count}</span>
                          <span className="text-muted-foreground">{feature.stats.label}</span>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="flex items-center gap-1 text-primary"
                        animate={{ 
                          x: isHovered ? 5 : 0,
                          opacity: isHovered ? 1 : 0.7
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </motion.div>
                    </div>

                    {/* Popularity bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Popularity</span>
                        <span>{feature.popularity}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <motion.div 
                          className="bg-primary rounded-full h-1.5"
                          initial={{ width: 0 }}
                          animate={{ width: `${feature.popularity}%` }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Large background icon */}
                <motion.div 
                  className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none"
                  animate={{ 
                    rotate: isHovered ? 10 : 0,
                    scale: isHovered ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="h-32 w-32" />
                </motion.div>
              </motion.div>
            ) : (
              // List View
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className={cn(
                  'group relative overflow-hidden rounded-lg cursor-pointer border transition-all duration-200',
                  'bg-card/80 dark:bg-card/40 backdrop-blur-sm p-4',
                  isCurrentPath ? 'ring-1 ring-primary/50 shadow-md shadow-primary/5' : 'border-border/60 hover:border-primary/30',
                  'hover:shadow-lg'
                )}
                onClick={() => router.push(feature.href)}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "p-3 rounded-lg transition-all duration-300",
                    'bg-gradient-to-br from-primary/20 to-primary/5 text-primary'
                  )}>
                    <feature.icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {feature.category}
                      </Badge>
                      {feature.featured && (
                        <Badge className="text-xs bg-primary">
                          <Star className="h-2.5 w-2.5 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {feature.badge && !feature.featured && (
                        <Badge variant="secondary" className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{feature.popularity}% popular</div>
                      <div className="text-xs text-primary font-medium">{feature.stats.count} {feature.stats.label}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredFeatures.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No features found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Clear filters
          </Button>
        </motion.div>
      )}

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center py-12 space-y-4"
      >
        <h2 className="text-2xl font-bold">Ready to explore more?</h2>
        <p className="text-muted-foreground">
          Start your legal education journey with our comprehensive suite of tools.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard/chat">
              <Sparkles className="h-4 w-4 mr-2" />
              Try AI Assistant
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard/courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Courses
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturesGrid;
