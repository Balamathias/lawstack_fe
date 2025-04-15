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
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.05)_0%,transparent_50%)]"></div>
        <motion.div 
          className="absolute top-20 left-10 w-60 h-60 rounded-full bg-emerald-500/10 blur-[80px]"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-green-500/10 blur-[100px]"
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/50 dark:bg-emerald-900/20 backdrop-blur-sm mb-4">
            <MessageCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Client Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Discover how LawStack is transforming legal workflows for professionals worldwide
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Main testimonial card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              className="bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-900/40 dark:to-gray-900/10 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl p-8 md:p-10 shadow-xl max-w-4xl mx-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-green-500/10 rounded-full blur-xl translate-x-1/4 translate-y-1/4"></div>
              
              <div className="relative flex flex-col md:flex-row gap-8 items-center">
                <motion.div 
                  className="w-28 h-28 relative rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20"></div>
                  <img 
                    src={testimonialsData[activeIndex].avatar} 
                    alt={testimonialsData[activeIndex].name}
                    className="w-full h-full object-cover relative z-10"
                  />
                  <div className="absolute inset-0 ring-4 ring-white/20 dark:ring-white/10"></div>
                </motion.div>
                
                <div className="flex-1 text-left">
                  <motion.div 
                    className="flex items-center mb-3 gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {renderStars(testimonialsData[activeIndex].rating)}
                  </motion.div>
                  
                  <motion.p 
                    className="text-gray-700 dark:text-gray-200 text-lg md:text-xl italic mb-6 relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Quote className="absolute -top-4 -left-4 text-emerald-500/20 w-10 h-10" />
                    "{testimonialsData[activeIndex].feedback}"
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {testimonialsData[activeIndex].name}
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {testimonialsData[activeIndex].role}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation controls */}
          <div className="flex justify-center mt-8 gap-4 items-center">
            <motion.button 
              onClick={handlePrev}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-white border border-white/20 dark:border-white/5 shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </motion.button>
            
            <div className="flex items-center space-x-3">
              {testimonialsData.map((_, i) => (
                <motion.button 
                  key={i}
                  onClick={() => {
                    setAutoplay(false);
                    setActiveIndex(i);
                  }}
                  className={`rounded-full transition-all ${
                    i === activeIndex 
                      ? "bg-emerald-500 w-8 h-2" 
                      : "bg-gray-300 dark:bg-gray-600 w-2 h-2 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            
            <motion.button 
              onClick={handleNext}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-white border border-white/20 dark:border-white/5 shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;