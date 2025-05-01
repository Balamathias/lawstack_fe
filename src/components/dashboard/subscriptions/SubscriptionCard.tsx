import { Subscription } from '@/@types/db';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '@/lib/utils';

interface SubscriptionCardProps {
  subscription: Subscription;
  isSelected: boolean;
  isExpanded: boolean;
  timeRemaining: React.ReactNode;
  onSelect: () => void;
  onToggleExpand: () => void;
}

const SubscriptionCard = ({
  subscription,
  isSelected,
  isExpanded,
  timeRemaining,
  onSelect,
  onToggleExpand
}: SubscriptionCardProps) => {
  // Function to determine the card's gradient based on plan type and status
  const getCardGradient = () => {
    if (subscription.status === 'active') {
      if (subscription.plan.label === 'premium') {
        return 'bg-gradient-to-br from-amber-50 to-card dark:from-amber-950/20 dark:to-card';
      } else if (subscription.plan.label === 'pro') {
        return 'bg-gradient-to-br from-blue-50 to-card dark:from-blue-950/20 dark:to-card';
      }
    }
    
    return 'bg-card';
  };

  return (
    <motion.div
      layoutId={`card-${subscription.id}`}
      onClick={onSelect}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        ${getCardGradient()}
        border rounded-xl overflow-hidden shadow-sm transition-all
        ${isSelected ? 'ring-2 ring-primary/50 border-primary/50' : 'border-border'}
      `}
    >
      {/* Top Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">
              {subscription.plan.name}
              
              {/* Show premium tag for premium plans */}
              {subscription.plan.label === 'premium' && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Premium
                </span>
              )}
            </h3>
            <StatusBadge status={subscription.status} />
          </div>
          
          <div className="text-right">
            <div className="text-xl font-bold">{formatCurrency(subscription.plan.price)}</div>
            <div className="text-xs text-muted-foreground">per {subscription.plan.duration}</div>
          </div>
        </div>
        
        {/* Subscription details */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {subscription.plan.description}
        </p>
        
        {/* Expiration info */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Expires</span>
          <div className="font-medium">{timeRemaining}</div>
        </div>
      </div>
      
      {/* Actions Row */}
      <div className="px-6 py-3 bg-muted/30 border-t border-border flex justify-between items-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Less Details
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              More Details
            </>
          )}
        </button>
        
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-background rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-background rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-border px-6 py-4 bg-muted/30"
        >
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Start Date</div>
              <div>{format(new Date(subscription.start_date), 'PPP')}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">End Date</div>
              <div>{format(new Date(subscription.end_date), 'PPP')}</div>
            </div>
            
            {subscription.trial_end && (
              <div>
                <div className="text-muted-foreground mb-1">Trial Ends</div>
                <div>{format(new Date(subscription.trial_end), 'PPP')}</div>
              </div>
            )}
            
            <div>
              <div className="text-muted-foreground mb-1">Auto-renew</div>
              <div>{subscription.is_auto_renew ? 'Yes' : 'No'}</div>
            </div>
          </div>
          
          {/* Coupon information if available */}
          {subscription.coupon && (
            <div className="mt-3 p-2 bg-accent rounded-md text-xs">
              <div className="font-medium">Applied Coupon: {subscription.coupon.code}</div>
              <div className="text-muted-foreground mt-0.5">
                {subscription.coupon.discount_percent ? `${subscription.coupon.discount_percent}% off` : `$${subscription.coupon.discount_amount} off`}
              </div>
            </div>
          )}
          
          {/* More actions */}
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 text-center text-xs bg-primary text-primary-foreground rounded hover:opacity-90 transition-colors">
              Manage
            </button>
            <button className="flex-1 py-2 text-center text-xs border border-border rounded hover:bg-muted transition-colors">
              View Invoice
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubscriptionCard;
