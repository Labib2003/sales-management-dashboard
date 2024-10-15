import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

export const db = new PrismaClient();

export const adapter = new PrismaAdapter(db.smd_Session, db.smd_User);
