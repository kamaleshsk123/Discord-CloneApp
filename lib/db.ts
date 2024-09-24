import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined; // Declaring global variable, this is fine
}

// Create or reuse PrismaClient instance
const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db; // This is using globalThis without var
}

export { db };
