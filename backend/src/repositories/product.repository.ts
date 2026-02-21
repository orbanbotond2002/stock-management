import { prisma } from '../db/prisma.js';

export const findAllProducts = (search?: string) =>
  prisma.product.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {},
    include: { stocks: { include: { warehouse: true } } },
  });

export const findProductById = (id: string) =>
  prisma.product.findUnique({
    where: { id },
    include: { stocks: { include: { warehouse: true } } },
  });

export const createProduct = (data: {
  sku: string;
  name: string;
  description?: string;
}) => prisma.product.create({ data });

export const updateProduct = (
  id: string,
  data: { sku?: string; name?: string; description?: string }
) => prisma.product.update({ where: { id }, data });

export const deleteProduct = (id: string) =>
  prisma.product.delete({ where: { id } });
