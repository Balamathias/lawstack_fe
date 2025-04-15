"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PatternBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Match canvas dimensions to window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 2; // Extend beyond viewport
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Generate grid points
    const gridSize = 40;
    const points: { x: number; y: number; originX: number; originY: number; }[] = [];
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        const px = x + Math.random() * 10;
        const py = y + Math.random() * 10;
        points.push({
          x: px,
          y: py,
          originX: px,
          originY: py
        });
      }
    }
    
    // Animation
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connecting lines
      ctx.beginPath();
      ctx.strokeStyle = isDarkMode ? 'rgba(16, 185, 129, 0.03)' : 'rgba(16, 185, 129, 0.05)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        
        // Subtle movement
        point.x += Math.sin(Date.now() * 0.001 + i * 0.5) * 0.2;
        point.y += Math.cos(Date.now() * 0.001 + i * 0.5) * 0.2;
        
        // Limit movement range
        const dx = point.x - point.originX;
        const dy = point.y - point.originY;
        if (Math.abs(dx) > 15) point.x -= dx * 0.02;
        if (Math.abs(dy) > 15) point.y -= dy * 0.02;
        
        // Connect nearby points
        for (let j = 0; j < points.length; j++) {
          if (i === j) continue;
          
          const p2 = points[j];
          const distance = Math.sqrt(Math.pow(point.x - p2.x, 2) + Math.pow(point.y - p2.y, 2));
          
          if (distance < gridSize * 1.5) {
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      
      ctx.stroke();
      
      // Draw points
      for (const point of points) {
        ctx.fillStyle = isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.2)';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
};

export default PatternBackground;
