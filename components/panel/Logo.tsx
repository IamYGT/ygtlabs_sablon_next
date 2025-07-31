"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
  href?: string;
  className?: string;
}

/**
 * Optimize edilmiş Logo komponenti - Enhanced with modern effects
 */
export default function Logo({ width = 160, height = 50, href = "/", className = "" }: LogoProps) {
  // Simple Logo component without effects
  const LogoImage = (
    <div className="relative">
      {/* Main logo - Light theme */}
      <Image 
        src="/logo/mems.png" 
        alt="Memsidea Logo" 
        width={width} 
        height={height}
        className={`w-auto h-auto dark:hidden ${className}`}
        priority
      />
      
      {/* Main logo - Dark theme */}
      <Image 
        src="/logo/memsbeyaz.png" 
        alt="Memsidea Logo" 
        width={width} 
        height={height}
        className={`w-auto h-auto hidden dark:block ${className}`}
        priority
      />
    </div>
  );

  // Link isteniyorsa with enhanced hover effects
  if (href) {
    return (
      <Link 
        href={href} 
        className="block transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background rounded-lg"
      >
        {LogoImage}
      </Link>
    );
  }

  // Sade logo
  return LogoImage;
}