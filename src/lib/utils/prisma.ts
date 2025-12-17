import { PrismaClient } from '@prisma/client';

// 開発中のにNode再起動でできるインスタンスを抑制
const globalPrisma = global as any;
export const prisma = globalPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalPrisma.prisma = prisma;
}
