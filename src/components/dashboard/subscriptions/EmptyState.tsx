import { motion } from 'framer-motion';

const EmptyState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[400px] flex flex-col items-center justify-center text-center p-6 rounded-lg border border-dashed border-border"
    >
      <div className="w-16 h-16 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">No Subscriptions Found</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        You don't have any active subscriptions. Upgrade to a premium plan to access all features and content.
      </p>
      <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all flex items-center gap-2 animate-float">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Get Started with Premium
      </button>
    </motion.div>
  );
};

export default EmptyState;
