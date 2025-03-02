import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Book, FileText, Scale, Search } from "lucide-react";

const features = [
  {
    title: "Past Questions",
    description: "Access an extensive database of past questions and answers",
    href: "/dashboard/past-questions",
    buttonText: "Start Exploring",
    icon: <Book className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />,
  },
  {
    title: "Law Stack AI Agent",
    description: "Automate legal document creation and processing",
    href: "/dashboard/chat",
    buttonText: "Dive In",
    icon: <FileText className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />,
  },
  {
    title: "Case Analysis",
    description: "Streamline your case workflow and organization",
    href: "/dashboard/case-management",
    buttonText: "Jump In",
    icon: <Scale className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />,
  },
  // {
  //   title: "Legal Encyclopedia",
  //   description: "Explore a vast library of all law materials you would ever need.",
  //   href: "/dashboard/pedia",
  //   buttonText: "Learn More",
  //   icon: <Search className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />,
  // },
];

const HeroSection = () => {
  return (
    <section className="flex flex-col gap-y-6 items-center justify-center py-12">
      <h2 className="text-5xl sm:text-6xl font-bold py-4 leading-snug font-delius text-center">
        Law <span className="bg-gradient-to-br from-emerald-400 to-green-600 text-transparent bg-clip-text">Stack</span>
      </h2>
      <p className="text-xl font-semibold text-muted-foreground max-w-3xl text-center">
        Your next-generation legal tech platform powered by cutting-edge technology. Learn Law the smart way.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 w-full max-w-6xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group p-6 rounded-2xl backdrop-blur-md dark:bg-white/5 dark:border dark:border-white/10 transition-all duration-300 bg-green-100 hover:text-white hover:scale-105 flex flex-col justify-between items-start hover:bg-green-400 border-black/10 shadow-lg"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full dark:bg-green-900/30 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground ">{feature.description}</p>
            <Button className="mt-4 rounded-full transition-colors" asChild>
              <Link href={feature.href}>{feature.buttonText}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
