'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from './loader';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const LoaderDemo = () => {
  const [selectedVariant, setSelectedVariant] = useState<'pulse' | 'spin' | 'dots' | 'orbital' | 'wave' | 'morphic' | 'particles'>('morphic');
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [showOverlay, setShowOverlay] = useState(false);

  const variants = [
    { name: 'morphic', label: 'Morphic Glass', description: 'Modern glassmorphic design with animated rings' },
    { name: 'particles', label: 'Particles', description: 'Floating particles with center pulse' },
    { name: 'orbital', label: 'Orbital', description: 'Classic orbiting dots animation' },
    { name: 'wave', label: 'Wave', description: 'Rhythmic wave pattern' },
    { name: 'pulse', label: 'Pulse', description: 'Pulsing glassmorphic container' },
    { name: 'spin', label: 'Spin', description: 'Spinning gradient ring' },
    { name: 'dots', label: 'Dots', description: 'Bouncing dots sequence' },
  ] as const;

  const sizes = [
    { name: 'sm', label: 'Small' },
    { name: 'md', label: 'Medium' },
    { name: 'lg', label: 'Large' },
    { name: 'xl', label: 'Extra Large' },
  ] as const;

  return (
    <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Modern Loader Components</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Professional, glassmorphic loading animations that integrate seamlessly with your design system
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-background/50 backdrop-blur-xl border-border/20">
        <CardHeader>
          <CardTitle>Customization Controls</CardTitle>
          <CardDescription>Choose variant, size, and display options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Variant Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Loader Variant</label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {variants.map((variant) => (
                <Button
                  key={variant.name}
                  variant={selectedVariant === variant.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedVariant(variant.name)}
                  className="text-xs"
                >
                  {variant.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Size</label>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <Button
                  key={size.name}
                  variant={selectedSize === size.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSize(size.name)}
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Overlay Toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant={showOverlay ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOverlay(!showOverlay)}
            >
              {showOverlay ? 'Hide' : 'Show'} Overlay Mode
            </Button>
            <span className="text-sm text-muted-foreground">
              Test the full-screen overlay loader
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Current Selection Display */}
      <Card className="bg-background/30 backdrop-blur-xl border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Current Selection: {variants.find(v => v.name === selectedVariant)?.label}
            <span className="text-sm font-normal text-muted-foreground">
              ({selectedSize.toUpperCase()})
            </span>
          </CardTitle>
          <CardDescription>
            {variants.find(v => v.name === selectedVariant)?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12 bg-background/20 rounded-xl border border-border/10">
            <Loader 
              variant={selectedVariant} 
              size={selectedSize}
              text="Loading your content..."
            />
          </div>
        </CardContent>
      </Card>

      {/* All Variants Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {variants.map((variant, index) => (
          <motion.div
            key={variant.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-background/40 backdrop-blur-xl border-border/20 hover:bg-background/50 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{variant.label}</CardTitle>
                <CardDescription className="text-sm">
                  {variant.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-8 bg-background/20 rounded-lg border border-border/10">
                  <Loader variant={variant.name} size="md" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Usage Examples */}
      <Card className="bg-background/30 backdrop-blur-xl border-border/20">
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>How to implement these loaders in your components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Basic Usage</h4>
              <code className="text-sm text-muted-foreground">
                {`<Loader variant="${selectedVariant}" size="${selectedSize}" text="Loading..." />`}
              </code>
            </div>
            <div className="bg-muted/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">With Overlay</h4>
              <code className="text-sm text-muted-foreground">
                {`<Loader variant="${selectedVariant}" size="${selectedSize}" overlay={true} text="Please wait..." />`}
              </code>
            </div>
            <div className="bg-muted/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Custom Styling</h4>
              <code className="text-sm text-muted-foreground">
                {`<Loader variant="${selectedVariant}" className="my-custom-class" />`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overlay Demo */}
      {showOverlay && (
        <Loader 
          variant={selectedVariant} 
          size={selectedSize}
          text="Overlay mode - Click 'Hide Overlay Mode' to close"
          overlay={true}
        />
      )}
    </div>
  );
};

export default LoaderDemo;
