import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prismaInstance: PrismaClient | undefined;
};

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prismaInstance) {
    globalForPrisma.prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma.prismaInstance;
}

// Resilient Proxy: lazily instantiates PrismaClient upon first access to prevent build-time crashes on Vercel
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    try {
      const client = getPrisma();
      const val = (client as any)[prop];
      if (typeof val === 'function') {
        return val.bind(client);
      }
      return val;
    } catch (err) {
      console.warn(`Prisma access warning for property "${String(prop)}":`, err);
      // Return a safe async no-op function for queries during static build time
      return () => Promise.resolve(null);
    }
  },
});
