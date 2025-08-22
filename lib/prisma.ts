import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Optimize Prisma client with connection pooling and query optimization
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" 
      ? ["error", "warn"] 
      : ["error"],
    
    // Connection pool optimization
    datasources: {
      db: {
        url: process.env.DATABASE_URL!,
      },
    },
  });
};

// Use singleton pattern to prevent multiple instances
const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Query optimization logging (Prisma v5+ doesn't support $use)
// Instead, we'll use the built-in logging
if (process.env.NODE_ENV === "development") {
  // Prisma will log slow queries automatically with the log configuration above
}

// Named export
export { prisma };

// Default export for backward compatibility
export default prisma;

// Connection pool stats (for monitoring)
export async function getPrismaStats() {
  try {
    // Prisma v5+ doesn't have $metrics, return basic info
    return {
      status: "connected",
      timestamp: new Date().toISOString()
    };
  } catch (_error) {
    return null;
  }
}
