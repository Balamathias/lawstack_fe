import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const features = [
    {
      title: "Past Questions",
      description: "Access an extensive database of past questions and answers",
      href: "/past-questions",
      buttonText: "Start Exploring",
    },
    {
      title: "Document Automation",
      description: "Automate legal document creation and processing",
      href: "/document-automation",
      buttonText: "Dive In",
    },
    {
      title: "Case Management",
      description: "Streamline your case workflow and organization",
      href: "/case-management",
      buttonText: "Learn More",
    }
]

const HeroSection = () => {
  return (
    <section className="flex flex-col gap-y-5 items-center justify-center">
        <h2 className="text-5xl sm:text-6xl font-bold py-4 text-center leading-snug font-delius">
          Law Stack
        </h2>
        <p className="text-xl font-semibold text-muted-foreground text-center">
          Your next-generation legal tech platform powered by cutting-edge technology. Learn Law the smart way.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

        {
            features.map((feature, index) => (
            <div
                key={index}
                className="group p-6 rounded-2xl backdrop-blur-md dark:bg-white/5 border dark:border-white/10 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex flex-col justify-between bg-black/5 border-black/10"
            >
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
                <Button className="mt-4 rounded-full w-fit cursor-pointer px-4"  asChild>
                  <Link href={feature.href}>
                    {feature.buttonText}
                  </Link>
                </Button>
            </div>
            ))
        }
        </div>
    </section>
  )
}

export default HeroSection
