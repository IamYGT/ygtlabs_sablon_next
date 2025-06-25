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
export function parseJSONField(value: any, locale: string): string {
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

  return value?.toString() || "";
}
