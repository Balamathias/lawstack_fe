import React from 'react'

const features = [
    { title: "Document Automation", description: "Automate legal document creation and processing" },
    { title: "Case Management", description: "Streamline your case workflow and organization" },
    { title: "Legal Research AI", description: "AI-powered legal research and analysis" },
    { title: "Client Portal", description: "Secure client communication and document sharing" },
    { title: "Contract Analysis", description: "Smart contract review and risk assessment" },
    { title: "Compliance Tools", description: "Stay compliant with automated checks and updates" },
  ];

const CoolCard = () => {
  return (
    <div className="">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent mb-6">
        Welcome to LegalX
        </h2>
        <p className="text-lg text-gray-200 mb-10">
        Your next-generation legal tech platform powered by cutting-edge technology
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
            <div
            key={index}
            className="group p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 
                        transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
            <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
            </h3>
            <p className="text-gray-300">
                {feature.description}
            </p>
            </div>
        ))}
        </div>
    </div>
  )
}

export default CoolCard
