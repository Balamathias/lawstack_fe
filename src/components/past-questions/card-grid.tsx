'use client';

import React from 'react';
import { motion } from 'framer-motion';
import QuestionGridItem from './question-grid-item';

interface CardGridProps {
  data: any[];
}

const CardGrid = ({ data }: CardGridProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {data.map((question, index) => (
        <QuestionGridItem
          key={question.id}
          question={question}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default CardGrid;
