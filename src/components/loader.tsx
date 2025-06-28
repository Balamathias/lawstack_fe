'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type LoaderVariant = 'pulse' | 'spin' | 'dots' | 'orbital' | 'wave' | 'morphic' | 'particles';
type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoaderProps {
    variant?: LoaderVariant;
    size?: LoaderSize;
    text?: string;
    className?: string;
    overlay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
    variant = 'morphic',
    size = 'lg',
    text,
    className = '',
    overlay = false,
}) => {    // Size mappings for consistent scaling
    const sizeConfig: Record<LoaderSize, { container: number; dot: number; spacing: number }> = {
        sm: { container: 40, dot: 6, spacing: 2 },
        md: { container: 60, dot: 8, spacing: 3 },
        lg: { container: 80, dot: 10, spacing: 4 },
        xl: { container: 100, dot: 12, spacing: 5 },
    };

    // Ensure we always have a valid config, fallback to 'md' if size is invalid
    const config = sizeConfig[size] || sizeConfig.md;const renderLoader = () => {
        // Safety check - ensure config is valid
        if (!config || typeof config.container !== 'number' || typeof config.dot !== 'number') {
            console.warn('Loader: Invalid size configuration, falling back to default');
            return (
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary animate-pulse" />
                    {text && (
                        <p className="text-sm font-medium text-muted-foreground tracking-wide">
                            {text}
                        </p>
                    )}
                </div>
            );
        }

        switch (variant) {
            case 'morphic':
                return (
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div 
                            className="relative flex items-center justify-center"
                            style={{ width: config.container, height: config.container }}
                        >
                            {/* Glassmorphic background */}
                            <div className="absolute inset-0 rounded-2xl bg-background/20 backdrop-blur-xl border border-border/20 shadow-2xl" />
                            
                            {/* Animated gradient rings */}
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    className="absolute rounded-full border-2"
                                    style={{
                                        width: config.container - index * 12,
                                        height: config.container - index * 12,
                                        borderColor: 'transparent',
                                        borderTopColor: 'hsl(var(--primary))',
                                        borderRightColor: index % 2 === 0 ? 'hsl(var(--primary) / 0.3)' : 'transparent',
                                    }}
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        duration: 2 + index * 0.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            ))}
                            
                            {/* Center orb */}
                            <motion.div
                                className="w-4 h-4 rounded-full bg-primary/80 shadow-lg shadow-primary/50"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.8, 1, 0.8],
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
                                className="text-sm font-medium text-muted-foreground tracking-wide"
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {text}
                            </motion.p>
                        )}
                    </div>
                );

            case 'particles':
                return (
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div 
                            className="relative"
                            style={{ width: config.container, height: config.container }}
                        >
                            {/* Background glass container */}
                            <div className="absolute inset-0 rounded-2xl bg-background/10 backdrop-blur-xl border border-border/20" />
                            
                            {/* Floating particles */}
                            {Array.from({ length: 8 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="absolute w-2 h-2 rounded-full bg-primary/60"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                    }}
                                    animate={{
                                        x: [0, Math.cos(index * 45 * Math.PI / 180) * 25],
                                        y: [0, Math.sin(index * 45 * Math.PI / 180) * 25],
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: index * 0.1,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}
                            
                            {/* Center pulse */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="w-3 h-3 rounded-full bg-primary"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </div>
                        </div>
                        {text && (
                            <p className="text-sm font-medium text-muted-foreground tracking-wide">
                                {text}
                            </p>
                        )}
                    </div>
                );

            case 'orbital':
                return (
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div 
                            className="relative"
                            style={{ width: config.container, height: config.container }}
                        >
                            {/* Glassmorphic base */}
                            <div className="absolute inset-0 rounded-full bg-background/5 backdrop-blur-md border border-border/10" />
                            
                            {/* Orbiting elements */}
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    className="absolute rounded-full bg-primary shadow-lg shadow-primary/30"
                                    style={{
                                        width: config.dot,
                                        height: config.dot,
                                    }}
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        duration: 1.5 + index * 0.3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    transformTemplate={(props) => {
                                        const radius = (config.container - config.dot) / 2 - index * 8;
                                        const angle = parseFloat(String(props?.rotate) || '0') + (index * 120);
                                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                                        const y = Math.sin((angle * Math.PI) / 180) * radius;
                                        return `translate(${x + config.container/2 - config.dot/2}px, ${y + config.container/2 - config.dot/2}px)`;
                                    }}
                                />
                            ))}
                        </div>
                        {text && (
                            <p className="text-sm font-medium text-muted-foreground tracking-wide">
                                {text}
                            </p>
                        )}
                    </div>
                );

            case 'wave':
                return (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex items-end gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-primary/80 rounded-t-full backdrop-blur-sm"
                                    style={{
                                        width: config.dot,
                                        height: config.container / 2,
                                    }}
                                    animate={{
                                        scaleY: [0.3, 1, 0.3],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.1,
                                    }}
                                />
                            ))}
                        </div>
                        {text && (
                            <p className="text-sm font-medium text-muted-foreground tracking-wide">
                                {text}
                            </p>
                        )}
                    </div>
                );

            case 'pulse':
                return (
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                            <motion.div
                                className="rounded-full bg-background/10 backdrop-blur-xl border border-border/20 shadow-2xl shadow-primary/10"
                                style={{
                                    width: config.container,
                                    height: config.container,
                                }}
                                animate={{
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        '0 25px 50px rgba(0,0,0,0.1), 0 0 0 1px hsl(var(--primary) / 0.1)',
                                        '0 25px 50px rgba(0,0,0,0.15), 0 0 30px hsl(var(--primary) / 0.2)',
                                        '0 25px 50px rgba(0,0,0,0.1), 0 0 0 1px hsl(var(--primary) / 0.1)'
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            <motion.div
                                className="absolute inset-4 rounded-full bg-primary/20"
                                animate={{
                                    rotate: 360,
                                    opacity: [0.2, 0.5, 0.2],
                                }}
                                transition={{
                                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                }}
                            />
                        </div>
                        {text && (
                            <p className="text-sm font-medium text-muted-foreground tracking-wide">
                                {text}
                            </p>
                        )}
                    </div>
                );

            case 'spin':
                return (
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div 
                            className="relative"
                            style={{ width: config.container, height: config.container }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-primary/0 via-primary to-primary/0"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent)',
                                    borderRadius: '50%',
                                    WebkitMask: 'radial-gradient(circle, transparent 40%, black 41%)',
                                    mask: 'radial-gradient(circle, transparent 40%, black 41%)',
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                            <div 
                                className="absolute inset-2 rounded-full bg-background/80 backdrop-blur-xl border border-border/20"
                            />
                        </div>
                        {text && (
                            <p className="text-sm font-medium text-muted-foreground tracking-wide">
                                {text}
                            </p>
                        )}
                    </div>
                );

            case 'dots':
            default:
                return (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="rounded-full bg-primary shadow-lg shadow-primary/30"
                                    style={{
                                        width: config.dot,
                                        height: config.dot,
                                    }}
                                    animate={{
                                        y: [-4, 0, -4],
                                        opacity: [0.6, 1, 0.6],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.1,
                                    }}
                                />
                            ))}
                        </div>
                        {text && (
                            <p className="text-sm font-medium text-muted-foreground tracking-wide">
                                {text}
                            </p>
                        )}
                    </div>
                );
        }
    };    const LoaderContent = (
        <div className={cn("flex items-center justify-center", className)}>
            {renderLoader()}
        </div>
    );

    if (overlay) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {LoaderContent}
            </div>
        );
    }

    return LoaderContent;
};

export default Loader;