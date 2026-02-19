import { prisma } from '../db/prisma.js';

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });