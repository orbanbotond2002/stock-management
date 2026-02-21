import { prisma } from '../db/prisma.js';
import { MovementType } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export const findStockByProductAndWarehouse = (
  productId: string,
  warehouseId: string
) =>
  prisma.stock.findUnique({
    where: { productId_warehouseId: { productId, warehouseId } },
  });

export const findAllMovements = (filters?: {
  type?: MovementType;
  warehouseId?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
}) =>
  prisma.stockMovement.findMany({
    where: {
      ...(filters?.type ? { type: filters.type } : {}),
      ...(filters?.productId ? { productId: filters.productId } : {}),
      ...(filters?.warehouseId
        ? {
            OR: [
              { sourceWarehouseId: filters.warehouseId },
              { targetWarehouseId: filters.warehouseId },
            ],
          }
        : {}),
      ...(filters?.startDate || filters?.endDate
        ? {
            createdAt: {
              ...(filters?.startDate
                ? { gte: new Date(filters.startDate) }
                : {}),
              ...(filters?.endDate ? { lte: new Date(filters.endDate) } : {}),
            },
          }
        : {}),
    },
    include: {
      product: true,
      sourceWarehouse: true,
      targetWarehouse: true,
      creator: { select: { id: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

export const createInMovement = (
  tx: Prisma.TransactionClient,
  data: {
    productId: string;
    targetWarehouseId: string;
    quantity: number;
    createdBy: string;
  }
) =>
  tx.stockMovement.create({
    data: {
      type: MovementType.IN,
      productId: data.productId,
      targetWarehouseId: data.targetWarehouseId,
      quantity: data.quantity,
      createdBy: data.createdBy,
    },
  });

export const createOutMovement = (
  tx: Prisma.TransactionClient,
  data: {
    productId: string;
    sourceWarehouseId: string;
    quantity: number;
    createdBy: string;
  }
) =>
  tx.stockMovement.create({
    data: {
      type: MovementType.OUT,
      productId: data.productId,
      sourceWarehouseId: data.sourceWarehouseId,
      quantity: data.quantity,
      createdBy: data.createdBy,
    },
  });

export const createTransferMovement = (
  tx: Prisma.TransactionClient,
  data: {
    productId: string;
    sourceWarehouseId: string;
    targetWarehouseId: string;
    quantity: number;
    createdBy: string;
  }
) =>
  tx.stockMovement.create({
    data: {
      type: MovementType.TRANSFER,
      productId: data.productId,
      sourceWarehouseId: data.sourceWarehouseId,
      targetWarehouseId: data.targetWarehouseId,
      quantity: data.quantity,
      createdBy: data.createdBy,
    },
  });

export const incrementStock = (
  tx: Prisma.TransactionClient,
  productId: string,
  warehouseId: string,
  quantity: number
) =>
  tx.stock.upsert({
    where: { productId_warehouseId: { productId, warehouseId } },
    create: { productId, warehouseId, quantity },
    update: { quantity: { increment: quantity } },
  });

export const decrementStock = (
  tx: Prisma.TransactionClient,
  productId: string,
  warehouseId: string,
  quantity: number
) =>
  tx.stock.update({
    where: { productId_warehouseId: { productId, warehouseId } },
    data: { quantity: { decrement: quantity } },
  });
