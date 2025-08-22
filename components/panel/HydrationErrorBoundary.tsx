'use client';

import React from 'react';

interface HydrationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface HydrationErrorBoundaryProps {
  children: React.ReactNode;
}

class HydrationErrorBoundary extends React.Component<HydrationErrorBoundaryProps, HydrationErrorBoundaryState> {
  constructor(props: HydrationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): HydrationErrorBoundaryState {
    // Hydration mismatch hatalarını yakala
    if (error.message.includes('hydration') || error.message.includes('Hydration')) {
      return { hasError: true, error };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Hydration hatalarını logla ama crash etme
    if (error.message.includes('hydration') || error.message.includes('Hydration')) {
      console.warn('Hydration mismatch caught by error boundary:', error);
      console.warn('Error info:', errorInfo);
      return;
    }

    // Diğer hatalar için normal error handling
    console.error('Error caught by HydrationErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error?.message.includes('hydration')) {
      // Hydration hatası durumunda children'ı render et (suppress hydration warning)
      return <div suppressHydrationWarning>{this.props.children}</div>;
    }

    return this.props.children;
  }
}

export default HydrationErrorBoundary;
