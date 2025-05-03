import { User } from "@/@types/db";

interface Props {
    user: User | null
}

const UpgradePrompt = ({ user }: Props) => {
  const isSubscribed = user?.is_subscribed;

  if (isSubscribed) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-card/60 to-card/80 border border-green-300/20 p-6 shadow-sm animate-fade-in-delay">
        <div className="absolute top-0 right-0">
          <svg width="218" height="109" viewBox="0 0 218 109" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
            <circle cx="109" cy="109" r="109" fill="url(#paint0_linear_subscribed)" />
            <defs>
              <linearGradient id="paint0_linear_subscribed" x1="0" y1="0" x2="218" y2="218" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 text-primary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth={2} stroke="currentColor" fill="#bbf7d0" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l2 2 4-4" stroke="var(--primary)" />
            </svg>
            <div>
              <h3 className="text-xl font-semibold mb-1">You're already subscribed!</h3>
              <p className="text-muted-foreground text-sm">
                Enjoy all the benefits of LawStack Pro. Thank you for being a valued member.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-radial from-primary/20 to-card border border-border p-6 shadow-sm animate-fade-in-delay">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0">
        <svg width="218" height="109" viewBox="0 0 218 109" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
          <circle cx="109" cy="109" r="109" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="218" y2="218" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--color-primary)" />
              <stop offset="1" stopColor="var(--color-background)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
            Limited Time Offer
          </span>
          <h3 className="text-xl font-semibold mt-2 mb-1">Upgrade to LawStack Pro</h3>
          <p className="text-muted-foreground mb-4">
            Get access to unlimited past questions, AI-powered analysis, and more.
          </p>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all">
              Upgrade Now
            </button>
            <span className="text-sm text-muted-foreground">
              Save 20% with annual billing
            </span>
          </div>
        </div>
        
        <div className="flex-shrink-0 bg-muted rounded-lg p-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">Unlimited Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">AI Assistance</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">Case Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">No Ads</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
