'use client'

import React from 'react';
import { motion } from 'framer-motion';

type LoaderVariant = 'pulse' | 'spin' | 'dots' | 'orbital' | 'wave';

interface LoaderProps {
    variant?: LoaderVariant;
    size?: number;
    color?: string;
    secondaryColor?: string;
    text?: string;
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({
    variant = 'orbital',
    size = 80,
    color = '#3b82f6',
    secondaryColor = '#8b5cf6',
    text,
    className = '',
}) => {
    const renderLoader = () => {
        switch (variant) {
            case 'orbital':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative" style={{ width: size, height: size }}>
                            {/* Glass background */}
                            <div 
                                className="absolute inset-0 rounded-full backdrop-blur-md border border-white/20"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                                }}
                            />
                            
                            {/* Orbiting dots */}
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    className="absolute rounded-full"
                                    style={{
                                        width: size / 8,
                                        height: size / 8,
                                        background: `linear-gradient(45deg, ${color}, ${secondaryColor})`,
                                        boxShadow: `0 0 20px ${color}40`,
                                    }}
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        duration: 2 + index * 0.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    transformTemplate={(props) => {
                                        const radius = (size - size / 8) / 2;
                                        const angle = parseFloat(String(props?.rotate) || '0') + (index * 120);
                                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                                        const y = Math.sin((angle * Math.PI) / 180) * radius;
                                        return `translate(${x + size/2 - size/16}px, ${y + size/2 - size/16}px)`;
                                    }}
                                />
                            ))}
                            
                            {/* Center glow */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{
                                    width: size / 6,
                                    height: size / 6,
                                    background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
                                }}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>
                        {text && (
                            <motion.p 
                                className="mt-6 text-sm font-medium tracking-wide"
                                style={{ color: color }}
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {text}
                            </motion.p>
                        )}
                    </div>
                );

            case 'wave':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center space-x-1">
                            {[0, 1, 2, 3, 4].map((index) => (
                                <motion.div
                                    key={index}
                                    className="rounded-full backdrop-blur-sm border border-white/30"
                                    style={{
                                        width: size / 6,
                                        height: size / 2,
                                        background: `linear-gradient(180deg, ${color}80 0%, ${secondaryColor}40 100%)`,
                                        boxShadow: `0 4px 16px ${color}30`,
                                    }}
                                    animate={{
                                        scaleY: [0.3, 1, 0.3],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.1,
                                    }}
                                />
                            ))}
                        </div>
                        {text && (
                            <p className="mt-4 text-sm font-medium tracking-wide opacity-80" style={{ color: color }}>
                                {text}
                            </p>
                        )}
                    </div>
                );

            case 'pulse':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative">
                            <motion.div
                                className="rounded-full backdrop-blur-lg border border-white/20"
                                style={{
                                    width: size,
                                    height: size,
                                    background: `radial-gradient(circle, ${color}20 0%, ${secondaryColor}10 100%)`,
                                    boxShadow: `0 0 40px ${color}30, inset 0 1px 0 rgba(255,255,255,0.2)`,
                                }}
                                animate={{
                                    scale: [1, 1.1, 1],
                                    boxShadow: [
                                        `0 0 40px ${color}30, inset 0 1px 0 rgba(255,255,255,0.2)`,
                                        `0 0 60px ${color}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
                                        `0 0 40px ${color}30, inset 0 1px 0 rgba(255,255,255,0.2)`
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            <motion.div
                                className="absolute inset-4 rounded-full"
                                style={{
                                    background: `linear-gradient(45deg, ${color}40, ${secondaryColor}40)`,
                                }}
                                animate={{
                                    rotate: 360,
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                }}
                            />
                        </div>
                        {text && (
                            <p className="mt-6 text-sm font-medium tracking-wide opacity-90" style={{ color: color }}>
                                {text}
                            </p>
                        )}
                    </div>
                );

            case 'spin':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative" style={{ width: size, height: size }}>
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-transparent backdrop-blur-sm"
                                style={{
                                    background: `linear-gradient(45deg, transparent, ${color}, transparent) border-box`,
                                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'subtract',
                                    borderImage: `linear-gradient(45deg, transparent, ${color}, transparent) 1`,
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                            <div 
                                className="absolute inset-2 rounded-full backdrop-blur-md border border-white/10"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                }}
                            />
                        </div>
                        {text && (
                            <p className="mt-4 text-sm font-medium tracking-wide opacity-80" style={{ color: color }}>
                                {text}
                            </p>
                        )}
                    </div>
                );

            case 'dots':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex space-x-3">
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    className="rounded-full backdrop-blur-sm border border-white/20"
                                    style={{
                                        width: size / 4,
                                        height: size / 4,
                                        background: `radial-gradient(circle, ${color}80 0%, ${secondaryColor}40 100%)`,
                                        boxShadow: `0 4px 20px ${color}40`,
                                    }}
                                    animate={{
                                        y: [-10, 0, -10],
                                        opacity: [0.6, 1, 0.6],
                                        boxShadow: [
                                            `0 4px 20px ${color}40`,
                                            `0 8px 30px ${color}60`,
                                            `0 4px 20px ${color}40`
                                        ],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.15,
                                    }}
                                />
                            ))}
                        </div>
                        {text && (
                            <p className="mt-4 text-sm font-medium tracking-wide opacity-80" style={{ color: color }}>
                                {text}
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-[120px] ${className}`}>
            {renderLoader()}
        </div>
    );
};

export default Loader;