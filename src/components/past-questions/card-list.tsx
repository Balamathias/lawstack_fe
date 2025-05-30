'use client';

import React from 'react';
import { motion } from 'framer-motion';
import QuestionListItem from './question-list-item';

interface CardListProps {
  data: any[];
}

const CardList = ({ data }: CardListProps) => {
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
      className="flex flex-col gap-5"
    >
      {data.map((question, index) => (
        <QuestionListItem
          key={question.id}
          question={question}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default CardList;
