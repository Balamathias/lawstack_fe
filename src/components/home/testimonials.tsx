"use client"

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';

const testimonialsData = [
  {
    id: 1,
    name: "Mathias Bala",
    role: "Founder, lawstack.io, Inc.",
    avatar: "/people/matiecodes.png",
    rating: 5,
    feedback: "LawStack has changed the way I navigate my route towards the legal profession. The platform is user-friendly and has helped me to understand the legal concepts in a more practical way.",
    highlight: "changed the way I navigate",
    color: "from-emerald-400 to-green-500"
  },
  {
    id: 2,
    name: "Serafina Adeola",
    role: "Database Administrator, LawStack",
    avatar: "/people/matiecodes.png",
    rating: 5,
    feedback: "LawStack has been a game-changer for our legal team. The platform is intuitive and easy to use, and the AI insights have helped us to make better decisions faster.",
    highlight: "game-changer for our legal team",
    color: "from-green-400 to-teal-500"
  },
  {
    id: 3,
    name: "Daniel Lad",
    role: "Legal Analyst, LawStack",
    avatar: "/people/matiecodes.png",
    rating: 4,
    feedback: "Implementing Law Stack reduced our contract review time by 60%. The automated compliance checks give us peace of mind while the interface made adoption remarkably smooth.",
    highlight: "reduced our contract review time by 60%",
    color: "from-teal-400 to-emerald-500"
  },
];

// Enhanced Background Component similar to hero
const TestimonialsBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Main gradient orb */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-radial from-emerald-500/6 via-emerald-400/3 to-transparent"></div>
    
    {/* Animated floating orbs */}
    <motion.div 
      className="absolute top-20 left-1/5 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/8 via-green-400/4 to-transparent blur-3xl"
      animate={{ 
        x: [0, 40, 0],
        y: [0, -25, 0],
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
    
    <motion.div 
      className="absolute bottom-20 right-1/5 w-72 h-72 rounded-full bg-gradient-to-br from-green-400/6 via-emerald-500/3 to-transparent blur-2xl"
      animate={{ 
        x: [0, -35, 0],
        y: [0, 20, 0],
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
    />
    
    {/* Premium grid pattern overlay */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.015] dark:opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="testimonialsGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="#10B981" />
          <circle cx="15" cy="15" r="0.5" fill="#10B981" />
          <circle cx="45" cy="15" r="0.5" fill="#10B981" />
          <circle cx="15" cy="45" r="0.5" fill="#10B981" />
          <circle cx="45" cy="45" r="0.5" fill="#10B981" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#testimonialsGrid)" />
    </svg>
    
    {/* Subtle line connections */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="testimonialsConnection" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d="M0,300 Q400,250 800,300 T1600,300" stroke="url(#testimonialsConnection)" strokeWidth="1" fill="none" />
      <path d="M0,400 Q500,350 1000,400 T2000,400" stroke="url(#testimonialsConnection)" strokeWidth="0.5" fill="none" />
    </svg>
  </div>
);

// Enhanced Card Pattern for each testimonial
const TestimonialCardPattern = ({ index }: { index: number }) => (
  <svg 
    className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id={`testimonialCardGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.03" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0.06" />
      </linearGradient>
      <pattern id={`testimonialPattern-${index}`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        {index === 0 && (
          <>
            <path d="M20 20L40 40M40 20L20 40" stroke="url(#testimonialCardGradient-${index})" strokeWidth="1" />
            <circle cx="60" cy="60" r="8" fill="none" stroke="url(#testimonialCardGradient-${index})" strokeWidth="1" />
          </>
        )}
        {index === 1 && (
          <>
            <circle cx="40" cy="40" r="15" fill="none" stroke="url(#testimonialCardGradient-${index})" strokeWidth="1" strokeDasharray="2,4" />
            <rect x="20" y="20" width="8" height="8" fill="url(#testimonialCardGradient-${index})" />
          </>
        )}
        {index === 2 && (
          <>
            <path d="M20 40L40 20L60 40L40 60Z" fill="none" stroke="url(#testimonialCardGradient-${index})" strokeWidth="1" />
            <circle cx="20" cy="60" r="3" fill="url(#testimonialCardGradient-${index})" />
          </>
        )}
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#testimonialPattern-${index})`} />
  </svg>
);

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonialsData.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current === 0 ? testimonialsData.length - 1 : current - 1));
  };

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % testimonialsData.length);
  };

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1, duration: 0.3 }}
      >
        <Star 
          size={18} 
          className={`${i < count ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"}`} 
          strokeWidth={1.5}
        />
      </motion.div>
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section ref={ref} className="relative overflow-hidden py-20 sm:py-28">
      <TestimonialsBackground />
      
      <motion.div 
        className="max-w-6xl mx-auto relative z-10 px-6"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={itemVariants}
        >
          {/* Enhanced badge */}
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/20 backdrop-blur-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Client Testimonials
            </span>
            <Sparkles className="w-3 h-3 text-emerald-500 ml-2" />
          </motion.div>

          {/* Enhanced heading */}
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            variants={itemVariants}
          >
            What Our{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 text-transparent bg-clip-text font-black">
                Clients
              </span>
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 rounded-full shadow-lg shadow-emerald-500/30"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              />
            </span>{" "}
            <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent font-black">
              Say
            </span>
          </motion.h2>

          <motion.p 
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Discover how LawStack is transforming legal workflows for professionals worldwide with{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-semibold">
              AI-powered innovation
            </span>
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="relative"
          variants={itemVariants}
        >
          {/* Enhanced glassmorphic testimonial card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              className="relative overflow-hidden p-8 md:p-12 rounded-3xl border border-white/30 dark:border-gray-800/30 bg-white/20 dark:bg-black/20 backdrop-blur-2xl shadow-2xl hover:shadow-3xl max-w-4xl mx-auto transition-all duration-500"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >              
              {/* Enhanced SVG Pattern */}
              <TestimonialCardPattern index={activeIndex} />
              
              {/* Premium glass overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-white/5 to-green-500/5 dark:from-emerald-400/5 dark:via-gray-900/5 dark:to-green-400/5 rounded-3xl"></div>
              
              {/* Floating orb effect */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-2xl opacity-60"></div>
              
              <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start relative z-10">
                {/* Enhanced avatar with premium styling */}
                <motion.div 
                  className="relative w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/60 dark:border-emerald-900/30 shadow-xl shadow-emerald-500/10 bg-gradient-to-br from-emerald-50/90 via-white/80 to-emerald-100/90 dark:from-emerald-900/40 dark:via-emerald-800/30 dark:to-emerald-900/40 p-1">
                    <img 
                      src={testimonialsData[activeIndex].avatar} 
                      alt={testimonialsData[activeIndex].name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  
                  {/* Floating accent */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50"
                    animate={{ 
                      y: [0, -4, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                
                <div className="flex-1 text-center lg:text-left">
                  {/* Enhanced rating stars */}
                  <motion.div 
                    className="flex justify-center lg:justify-start items-center mb-4 gap-1 bg-white/30 dark:bg-black/20 rounded-2xl px-4 py-2 backdrop-blur-sm inline-flex border border-white/20 dark:border-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {renderStars(testimonialsData[activeIndex].rating)}
                    <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {testimonialsData[activeIndex].rating}/5
                    </span>
                  </motion.div>
                  
                  {/* Enhanced testimonial text */}
                  <motion.div
                    className="relative mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Quote className="absolute -top-4 -left-4 text-emerald-500/20 w-12 h-12" />
                    <p className="text-gray-700 dark:text-gray-200 text-xl lg:text-2xl leading-relaxed relative z-10 pl-4">
                      "{testimonialsData[activeIndex].feedback.split(testimonialsData[activeIndex].highlight)[0]}
                      <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-semibold">
                        {testimonialsData[activeIndex].highlight}
                      </span>
                      {testimonialsData[activeIndex].feedback.split(testimonialsData[activeIndex].highlight)[1]}"
                    </p>
                    <Quote className="absolute -bottom-2 -right-2 text-emerald-500/20 w-8 h-8 transform rotate-180" />
                  </motion.div>
                  
                  {/* Enhanced name and role */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="bg-white/40 dark:bg-black/30 backdrop-blur-xl px-6 py-4 rounded-2xl inline-block border border-white/30 dark:border-white/10"
                  >
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {testimonialsData[activeIndex].name}
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {testimonialsData[activeIndex].role}
                    </p>
                    
                    {/* Enhanced divider */}
                    <motion.div 
                      className="h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mx-auto lg:mx-0 mt-2 shadow-sm shadow-emerald-500/30"
                      initial={{ width: 0 }}
                      animate={{ width: "3rem" }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    />
                  </motion.div>
                </div>
              </div>
              
              {/* Enhanced gradient border effect */}
              <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-60 rounded-b-3xl"></div>
              
              {/* Corner accents */}
              <div className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-60"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-40"></div>
            </motion.div>
          </AnimatePresence>
          
          {/* Enhanced navigation controls */}
          <motion.div 
            className="flex justify-center mt-12 gap-4 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Prev button */}
            <motion.button 
              onClick={handlePrev}
              className="group relative p-3 rounded-2xl bg-white/60 dark:bg-gray-800/50 text-gray-700 dark:text-white border border-white/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl backdrop-blur-xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/10 to-green-400/10 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
            
            {/* Enhanced indicator dots */}
            <div className="flex items-center space-x-3 bg-white/40 dark:bg-black/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/30 dark:border-white/10">
              {testimonialsData.map((_, i) => (
                <motion.button 
                  key={i}
                  onClick={() => {
                    setAutoplay(false);
                    setActiveIndex(i);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex 
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 w-8 h-3 shadow-lg shadow-emerald-500/30" 
                      : "bg-gray-300/60 dark:bg-gray-600/50 w-3 h-3 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-110"
                  }`}
                  whileHover={{ scale: i === activeIndex ? 1 : 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Next button */}
            <motion.button 
              onClick={handleNext}
              className="group relative p-3 rounded-2xl bg-white/60 dark:bg-gray-800/50 text-gray-700 dark:text-white border border-white/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl backdrop-blur-xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/10 to-green-400/10 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
          
          {/* Auto-play indicator */}
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/20 dark:bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${autoplay ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span>{autoplay ? 'Auto-playing' : 'Paused'}</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Testimonials;