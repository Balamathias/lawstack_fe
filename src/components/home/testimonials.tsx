"use client"

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonialsData = [
  {
    id: 1,
    name: "Mathias Bala",
    role: "Founder, lawstack.io, Inc.",
    avatar: "/people/matiecodes.png",
    rating: 5,
    feedback: "LawStack has changed the way I navigate my route towards the legal profession. The platform is user-friendly and has helped me to understand the legal concepts in a more practical way."
  },
  {
    id: 2,
    name: "Serafina Adeola",
    role: "Database Administrator, LawStack",
    avatar: "/people/matiecodes.png",
    rating: 5,
    feedback: "LawStack has been a game-changer for our legal team. The platform is intuitive and easy to use, and the AI insights have helped us to make better decisions faster."
  },
  {
    id: 3,
    name: "Daniel Lad",
    role: "Legal Analyst, LawStack",
    avatar: "/people/matiecodes.png",
    rating: 4,
    feedback: "Implementing Law Stack reduced our contract review time by 60%. The automated compliance checks give us peace of mind while the interface made adoption remarkably smooth."
  },
];

// SVG Pattern Components
const TestimonialsPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="testimonialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.03" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.07" />
      </linearGradient>
      <pattern id="testimonialPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M20 20L40 20L40 40L20 40Z" fill="none" stroke="url(#testimonialGradient)" strokeWidth="1" />
        <path d="M60 60L80 60L80 80L60 80Z" fill="none" stroke="url(#testimonialGradient)" strokeWidth="1" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="url(#testimonialGradient)" strokeWidth="1" strokeDasharray="1,3" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#testimonialPattern)" />
  </svg>
);

const CardPattern = ({ index }: { index: number }) => (
  <svg 
    className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id={`cardGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.02" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
      </linearGradient>
      <pattern id={`quotePattern-${index}`} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        {index === 0 && (
          <path d="M5 15 Q10 5, 15 15 L15 25 Q10 20, 5 25 Z" fill="url(#cardGradient-${index})" />
        )}
        {index === 1 && (
          <circle cx="25" cy="25" r="10" fill="none" stroke="url(#cardGradient-${index})" strokeWidth="1" />
        )}
        {index === 2 && (
          <rect x="15" y="15" width="20" height="20" fill="none" stroke="url(#cardGradient-${index})" strokeWidth="1" />
        )}
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#quotePattern-${index})`} />
  </svg>
);

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonialsData.length);
    }, 5000);
    
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
      <Star 
        key={i} 
        size={16} 
        className={`${i < count ? "fill-yellow-400 text-yellow-400" : "fill-gray-400 text-gray-400"}`} 
        strokeWidth={1.5}
      />
    ));
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Glassmorphic background with SVG patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 dark:opacity-25">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-radial from-emerald-500/5 to-transparent"></div>
        </div>
        
        {/* Main pattern */}
        <TestimonialsPattern />
        
        {/* Multiple subtle animated elements */}
        <motion.div 
          className="absolute bottom-40 left-1/3 w-28 h-28 rounded-full bg-emerald-500/5 blur-xl"
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            y: [0, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400/5 to-green-500/3 blur-xl"
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            x: [0, 10, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge with subtle gradient */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 backdrop-blur-sm">
            <MessageCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Client Testimonials</span>
          </div>
          
          {/* Clean heading with gradient */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-transparent bg-clip-text">Clients Say</span>
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Discover how LawStack is transforming legal workflows for professionals worldwide
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Enhanced glassmorphic testimonial card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              className="relative bg-white/60 dark:bg-gray-900/40 backdrop-blur-lg border border-white/20 dark:border-white/5 rounded-xl p-8 md:p-10 shadow-sm max-w-3xl mx-auto overflow-hidden"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >              
              {/* SVG Pattern specific to each testimonial */}
              <CardPattern index={activeIndex} />
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/40 dark:from-black/0 dark:to-black/20 opacity-70 pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                {/* Avatar with elegant glass styling */}
                <motion.div 
                  className="w-20 h-20 relative rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/80 dark:border-emerald-900/30 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img 
                    src={testimonialsData[activeIndex].avatar} 
                    alt={testimonialsData[activeIndex].name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 dark:ring-emerald-500/10"></div>
                </motion.div>
                
                <div className="flex-1 text-center md:text-left">
                  {/* Rating stars with enhanced styling */}
                  <motion.div 
                    className="md:justify-start justify-center items-center mb-3 gap-1 bg-white/20 dark:bg-black/10 rounded-full px-3 py-1 backdrop-blur-sm inline-flex"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStars(testimonialsData[activeIndex].rating)}
                  </motion.div>
                  
                  {/* Testimonial text with elegant quote styling */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Quote className="absolute -top-2 -left-2 text-emerald-500/20 w-8 h-8" />
                    <p className="text-gray-700 dark:text-gray-200 text-lg italic mb-6 pt-2 pl-2 relative z-10">
                      "{testimonialsData[activeIndex].feedback}"
                    </p>
                  </motion.div>
                  
                  {/* Name and role with glass card effect */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-4 bg-white/30 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg inline-block"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {testimonialsData[activeIndex].name}
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {testimonialsData[activeIndex].role}
                    </p>
                    
                    {/* Subtle divider */}
                    <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-300/20 to-green-500/40 rounded-full mx-auto md:mx-0 mt-1"></div>
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <Quote className="w-12 h-12 text-emerald-500 transform rotate-180" />
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Enhanced navigation controls with glass effect */}
          <div className="flex justify-center mt-8 gap-3 items-center">
            {/* Prev button */}
            <motion.button 
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/70 dark:bg-gray-800/50 text-gray-700 dark:text-white border border-white/80 dark:border-gray-700/80 shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 backdrop-blur-md transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </motion.button>
            
            {/* Indicator pill shaped dots */}
            <div className="flex items-center space-x-2 bg-white/40 dark:bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 dark:border-white/5">
              {testimonialsData.map((_, i) => (
                <motion.button 
                  key={i}
                  onClick={() => {
                    setAutoplay(false);
                    setActiveIndex(i);
                  }}
                  className={`rounded-full transition-all ${
                    i === activeIndex 
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 w-6 h-2 shadow-sm" 
                      : "bg-gray-300/60 dark:bg-gray-600/50 w-2 h-2 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Next button */}
            <motion.button 
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/70 dark:bg-gray-800/50 text-gray-700 dark:text-white border border-white/80 dark:border-gray-700/80 shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 backdrop-blur-md transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;