import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

let databaseUrl = process.env.DATABASE_URL || 'file:./clinic.db';

// In Vercel serverless environment, the lambda filesystem is read-only.
// We copy the seeded clinic.db to /tmp/clinic.db so SQLite read & write operations succeed.
if (process.env.VERCEL) {
  const tmpDb = '/tmp/clinic.db';
  if (!fs.existsSync(tmpDb)) {
    const candidates = [
      path.join(process.cwd(), 'backend/prisma/clinic.db'),
      path.join(process.cwd(), 'prisma/clinic.db'),
      path.join(__dirname, '../prisma/clinic.db'),
      path.join(__dirname, '../../backend/prisma/clinic.db'),
      path.resolve('backend/prisma/clinic.db'),
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        try {
          fs.copyFileSync(c, tmpDb);
          console.log(`[Vercel] Initialized /tmp/clinic.db from ${c}`);
          break;
        } catch (e) {
          console.error('[Vercel] Error copying clinic.db to /tmp:', e);
        }
      }
    }
  }
  databaseUrl = `file:${tmpDb}`;
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

