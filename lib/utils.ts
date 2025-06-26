import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

// JSON field parse etme fonksiyonu
export function parseJSONField(
  value: string | { [key: string]: string } | null | undefined,
  locale: string
): string {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      // Hem obje hem de basit string için çalışır
      if (typeof parsed === "object" && parsed !== null) {
        return parsed?.[locale] || parsed?.en || JSON.stringify(parsed);
      }
      return parsed.toString();
    } catch {
      return value;
    }
  }

  if (typeof value === "object" && value !== null) {
    return value[locale] || value.en || Object.values(value)[0] || "";
  }

  return value ? String(value) : "";
}

// =============================================================================
// PERFORMANCE OPTIMIZATION UTILITIES
// =============================================================================

/**
 * Optimized setTimeout wrapper using requestAnimationFrame
 * Reduces performance violations by using RAF for better timing
 */
export function optimizedTimeout(callback: () => void, delay: number): number {
  if (delay <= 16) {
    // For very short delays, use RAF directly
    return requestAnimationFrame(callback);
  }

  // For longer delays, use RAF + setTimeout combination
  const startTime = performance.now();
  const frame = () => {
    const elapsed = performance.now() - startTime;
    if (elapsed >= delay) {
      callback();
    } else {
      requestAnimationFrame(frame);
    }
  };

  return requestAnimationFrame(frame);
}

/**
 * Debounced function executor with RAF optimization
 */
export function debounceRAF<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): T {
  let timeoutId: number | null = null;
  let lastCallTime = 0;

  return ((...args: Parameters<T>) => {
    const now = performance.now();

    if (timeoutId) {
      cancelAnimationFrame(timeoutId);
    }

    const execute = () => {
      lastCallTime = now;
      func(...args);
    };

    if (now - lastCallTime >= wait) {
      execute();
    } else {
      timeoutId = requestAnimationFrame(() => {
        setTimeout(execute, Math.max(0, wait - (performance.now() - now)));
      });
    }
  }) as T;
}

/**
 * Throttled function executor with RAF optimization
 */
export function throttleRAF<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle = false;
  let lastCallTime = 0;

  return ((...args: Parameters<T>) => {
    const now = performance.now();

    if (!inThrottle || now - lastCallTime >= limit) {
      func(...args);
      lastCallTime = now;
      inThrottle = true;

      requestAnimationFrame(() => {
        setTimeout(() => {
          inThrottle = false;
        }, Math.max(0, limit - (performance.now() - now)));
      });
    }
  }) as T;
}

/**
 * Optimized animation class generator
 * Reduces animation durations for better performance
 */
export function getOptimizedAnimationClass(
  baseClass: string,
  duration: "fast" | "normal" | "slow" = "normal"
): string {
  const durations = {
    fast: "duration-150",
    normal: "duration-200",
    slow: "duration-300",
  };

  return `${baseClass} transition-all ${durations[duration]} ease-out`;
}

/**
 * Performance-aware intersection observer
 */
export function createOptimizedObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const optimizedCallback: IntersectionObserverCallback = (
    entries,
    observer
  ) => {
    requestAnimationFrame(() => {
      callback(entries, observer);
    });
  };

  return new IntersectionObserver(optimizedCallback, {
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  });
}
