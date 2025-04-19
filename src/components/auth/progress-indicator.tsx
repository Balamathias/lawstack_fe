import React from 'react'

interface ProgressIndicatorProps {
  currentStep: number
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-3 md:space-x-5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          currentStep === 1 
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
            : 'bg-primary/20 text-primary border border-primary/30'
        }`}>1</div>
        <div className="w-12 md:w-16 h-1 bg-border rounded-full">
          <div className={`h-full bg-primary rounded-full transition-all ${
            currentStep > 1 ? 'w-full' : 'w-0'
          }`}></div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          currentStep === 2 
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
            : currentStep > 2 
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-muted text-muted-foreground'
        }`}>2</div>
        <div className="w-12 md:w-16 h-1 bg-border rounded-full">
          <div className={`h-full bg-primary rounded-full transition-all ${
            currentStep > 2 ? 'w-full' : 'w-0'
          }`}></div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          currentStep === 3 
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
            : currentStep > 3
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-muted text-muted-foreground'
        }`}>3</div>
        <div className="w-12 md:w-16 h-1 bg-border rounded-full">
          <div className={`h-full bg-primary rounded-full transition-all ${
            currentStep > 3 ? 'w-full' : 'w-0'
          }`}></div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          currentStep === 4 
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
            : 'bg-muted text-muted-foreground'
        }`}>4</div>
      </div>
    </div>
  )
}

export default ProgressIndicator
