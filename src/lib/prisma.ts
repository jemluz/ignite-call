import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query"], // setup to show each sql query that will be run
});
