import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import os from 'os';

const globalForPrisma = globalThis as unknown as {
  prismaInstance: PrismaClient | undefined;
};

function getWritableDatabaseUrl(): string | undefined {
  // If an external DATABASE_URL was set to something non-SQLite (e.g. Postgres from Vercel storage env), clean it up immediately
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    delete process.env.DATABASE_URL;
  }

  // If a valid SQLite file URL is explicitly set, use it
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:') && process.env.DATABASE_URL.length > 5) {
    return process.env.DATABASE_URL;
  }

  // Detect serverless environment (Vercel, AWS Lambda, etc.)
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.NODE_ENV === 'production'
  );

  if (isServerless) {
    try {
      const tmpDbPath = path.join(os.tmpdir(), 'sushanti_dev.db');

      // Check if /tmp database already exists and is non-empty
      let needsCopy = true;
      if (fs.existsSync(tmpDbPath)) {
        try {
          const stats = fs.statSync(tmpDbPath);
          if (stats.size > 0) {
            needsCopy = false;
          }
        } catch {}
      }

      if (needsCopy) {
        // Search potential source locations in Vercel bundle
        const searchRoots = [
          process.cwd(),
          path.join(process.cwd(), '.next', 'server'),
          __dirname,
          path.resolve(__dirname, '..'),
          path.resolve(__dirname, '..', '..'),
        ];

        let sourceDbPath: string | null = null;
        for (const root of searchRoots) {
          const candidate = path.join(root, 'prisma', 'dev.db');
          if (fs.existsSync(candidate)) {
            try {
              if (fs.statSync(candidate).size > 0) {
                sourceDbPath = candidate;
                break;
              }
            } catch {}
          }
        }

        // Direct candidate
        if (!sourceDbPath) {
          const direct = path.resolve('prisma/dev.db');
          if (fs.existsSync(direct) && fs.statSync(direct).size > 0) {
            sourceDbPath = direct;
          }
        }

        if (sourceDbPath) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
          try {
            fs.chmodSync(tmpDbPath, 0o666);
          } catch {}
          console.log(`[Prisma] Initialized writable SQLite database at ${tmpDbPath} from ${sourceDbPath}`);
        } else {
          console.warn('[Prisma] Bundled dev.db not found for copying to tmp');
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        const fileUrl = `file:${tmpDbPath}`;
        process.env.DATABASE_URL = fileUrl;
        return fileUrl;
      }
    } catch (err) {
      console.warn('[Prisma] Error initializing writable database in tmp:', err);
    }
  }

  return undefined;
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prismaInstance) {
    const dbUrl = getWritableDatabaseUrl();
    const options: any = {
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    };

    // ONLY pass datasources.db.url if it strictly begins with 'file:'
    if (dbUrl && typeof dbUrl === 'string' && dbUrl.startsWith('file:')) {
      options.datasources = {
        db: {
          url: dbUrl,
        },
      };
    }

    globalForPrisma.prismaInstance = new PrismaClient(options);
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
