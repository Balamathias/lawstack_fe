"use client";

import React from 'react';
import { motion } from 'framer-motion';

const GradientOrbs: React.FC = () => {
  // Create an array of orb objects with random positions and animation properties
  const orbs = [
    {
      id: 1,
      size: 600,
      top: "10%",
      left: "5%",
      duration: 25,
      delay: 0,
      from: "emerald-500",
      to: "emerald-400",
      opacity: 0.08
    },
    {
      id: 2,
      size: 500,
      top: "60%",
      left: "80%",
      duration: 30,
      delay: 2,
      from: "green-500",
      to: "emerald-400", 
      opacity: 0.06
    },
    {
      id: 3,
      size: 400,
      top: "30%",
      left: "90%",
      duration: 20,
      delay: 1,
      from: "blue-500",
      to: "cyan-400",
      opacity: 0.05
    },
    {
      id: 4,
      size: 700,
      top: "80%",
      left: "20%",
      duration: 35,
      delay: 3,
      from: "emerald-500",
      to: "green-400",
      opacity: 0.07
    },
    {
      id: 5,
      size: 350,
      top: "5%",
      left: "60%",
      duration: 22,
      delay: 2.5,
      from: "emerald-400",
      to: "blue-500",
      opacity: 0.04
    }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full blur-[120px] bg-gradient-to-br from-${orb.from}/20 to-${orb.to}/10 dark:from-${orb.from}/10 dark:to-${orb.to}/5`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            opacity: orb.opacity,
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -30, 50, -20, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
};

export default GradientOrbs;
