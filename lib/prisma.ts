import { PrismaClient } from "@prisma/client";

// PrismaClient'ı global nesne olarak tanımla
// Bu, development sırasında hot-reloading ile çoklu PrismaClient bağlantısı oluşmasını önler
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
