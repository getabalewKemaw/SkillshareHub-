//start the server with "D:\postgresql-18.0-1-windows-x64-binaries\pgsql\bin\pg_ctl.exe" -D "D:\pgsql-data" -l "D:\pgsql-data\logfile.log" start

import { PrismaClient } from "@prisma/client";
declare global {
  // Prevent multiple instances of Prisma Client in development (Next.js hot reload)
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "warn", "error"], // optional: helps debug
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
