import { motion } from 'framer-motion';

interface FeaturesListProps {
  features: string;
}

const FeaturesList = ({ features }: FeaturesListProps) => {
    console.log('FeaturesList rendered with features:', features);
  return (
    <ul className="space-y-2">
      {features.split(',').map((feature, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start"
        >
          <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="text-sm">{feature.trim()}</span>
        </motion.li>
      ))}
    </ul>
  );
};

export default FeaturesList;
