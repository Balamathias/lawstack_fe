"use client"

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Corporate Lawyer, Johnson & Associates",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    rating: 5,
    feedback: "Law Stack transformed our document review process. The AI-powered analysis saved us countless hours and improved accuracy dramatically."
  },
  {
    id: 2,
    name: "Robert Smith",
    role: "General Counsel, Tech Innovations Inc.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    feedback: "As someone overseeing legal operations for a fast-growing company, Law Stack has become indispensable. The platform's intuitive design makes complex legal work streamlined and efficient."
  },
  {
    id: 3,
    name: "Sarah Williams",
    role: "Legal Operations Manager, Global Finance",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
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
      <Star key={i} size={16} className={`${i < count ? "fill-yellow-400 text-yellow-400" : "fill-gray-400 text-gray-400"}`} />
    ));
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Client Testimonials</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            See what legal professionals are saying about our platform
          </p>
        </div>
        
        <div className="relative">
          {/* Main testimonial card */}
          <div 
            key={activeIndex}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl max-w-4xl mx-auto transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-white/30 shadow-inner flex-shrink-0">
                <img 
                  src={testimonialsData[activeIndex].avatar} 
                  alt={testimonialsData[activeIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center mb-2">
                  {renderStars(testimonialsData[activeIndex].rating)}
                </div>
                
                <p className="text-muted-foreground text-lg italic mb-4">
                  "{testimonialsData[activeIndex].feedback}"
                </p>
                
                <div>
                  <h3 className="text-xl font-bold">
                    {testimonialsData[activeIndex].name}
                  </h3>
                  <p className="text-green-300">
                    {testimonialsData[activeIndex].role}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quote mark decoration */}
            <div className="absolute top-4 right-6 opacity-20">
              <Quote className="text-white w-8 h-8" />
            </div>
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-center mt-6 gap-3">
            <button 
              onClick={handlePrev}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center space-x-2">
              {testimonialsData.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setAutoplay(false);
                    setActiveIndex(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex ? "bg-white w-4" : "bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;