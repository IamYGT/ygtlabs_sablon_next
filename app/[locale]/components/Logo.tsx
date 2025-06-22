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
 * Optimize edilmiş Logo komponenti
 */
export default function Logo({ width = 160, height = 50, href = "/", className = "" }: LogoProps) {
  // Logo bileşeni
  const LogoImage = (
    <Image 
      src="/logo.png" 
      alt="Dünya Ekonomi Logo" 
      width={width} 
      height={height}
      className={`w-auto h-auto ${className}`}
      priority
    />
  );

  // Link isteniyorsa
  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {LogoImage}
      </Link>
    );
  }

  // Sade logo
  return LogoImage;
} 