"use client";
import { cn } from "../../lib/utils";
import React, { ReactNode } from "react";
import { AnimatedGridPattern } from "./animated-grid-pattern";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showAnimatedGrid?: boolean;
  variant?: "default" | "minimal" | "gradient";
}

export const AuroraBackground = ({
  className,
  children,
  showAnimatedGrid = true,
  variant = "default",
  ...props
}: AuroraBackgroundProps) => {
  const getBackgroundClasses = () => {
    switch (variant) {
      case "minimal":
        return "bg-[#F2F1EF] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900";
      case "gradient":
        return "bg-[#F2F1EF] dark:from-slate-900 dark:via-blue-900 dark:to-purple-900";
      default:
        return "bg-[#F2F1EF] dark:from-gray-900 dark:via-slate-900 dark:to-gray-800";
    }
  };

  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col min-h-screen items-center justify-center text-slate-950 dark:text-slate-50 transition-all duration-500",
          getBackgroundClasses(),
          className
        )}
        {...props}
      >
        {/* Modern Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-gray-100/50 dark:from-slate-900/80 dark:via-transparent dark:to-slate-800/50" />
          
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
          
          {/* Animated Grid Pattern */}
          {showAnimatedGrid && (
            <AnimatedGridPattern
              numSquares={40}
              maxOpacity={0.05}
              duration={4}
              repeatDelay={0.8}
              className={cn(
                "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-20%] h-[140%]",
                "fill-gray-400/10 stroke-gray-400/10 dark:fill-gray-300/10 dark:stroke-gray-300/10"
              )}
            />
          )}
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </main>
  );
};
