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

export const findProductBySku = (sku: string) =>
  prisma.product.findUnique({ where: { sku } });

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

export const deleteStocksByProductId = (productId: string) =>
  prisma.stock.deleteMany({ where: { productId } });

export const countStockMovementsByProductId = (productId: string) =>
  prisma.stockMovement.count({ where: { productId } });
