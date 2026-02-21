import { prisma } from '../db/prisma.js';
import { MovementType } from '@prisma/client';
import * as movementRepo from '../repositories/stockMovement.repository.js';
import { insufficientStock, invalidTransfer } from '../utils/errors.js';

export const getAllMovements = (filters?: {
  type?: MovementType;
  warehouseId?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
}) => movementRepo.findAllMovements(filters);

export const processInMovement = (data: {
  productId: string;
  targetWarehouseId: string;
  quantity: number;
  createdBy: string;
}) =>
  prisma.$transaction(async (tx) => {
    const movement = await movementRepo.createInMovement(tx, data);
    await movementRepo.incrementStock(
      tx,
      data.productId,
      data.targetWarehouseId,
      data.quantity
    );
    return movement;
  });

export const processOutMovement = async (data: {
  productId: string;
  sourceWarehouseId: string;
  quantity: number;
  createdBy: string;
}) => {
  const stock = await movementRepo.findStockByProductAndWarehouse(
    data.productId,
    data.sourceWarehouseId
  );
  if (!stock || stock.quantity < data.quantity) throw insufficientStock();

  return prisma.$transaction(async (tx) => {
    const movement = await movementRepo.createOutMovement(tx, data);
    await movementRepo.decrementStock(
      tx,
      data.productId,
      data.sourceWarehouseId,
      data.quantity
    );
    return movement;
  });
};

export const processTransferMovement = async (data: {
  productId: string;
  sourceWarehouseId: string;
  targetWarehouseId: string;
  quantity: number;
  createdBy: string;
}) => {
  const stock = await movementRepo.findStockByProductAndWarehouse(
    data.productId,
    data.sourceWarehouseId
  );
  if (!stock || stock.quantity < data.quantity) throw insufficientStock();

  if (data.sourceWarehouseId === data.targetWarehouseId)
    throw invalidTransfer();

  return prisma.$transaction(async (tx) => {
    const movement = await movementRepo.createTransferMovement(tx, data);
    await movementRepo.decrementStock(
      tx,
      data.productId,
      data.sourceWarehouseId,
      data.quantity
    );
    await movementRepo.incrementStock(
      tx,
      data.productId,
      data.targetWarehouseId,
      data.quantity
    );
    return movement;
  });
};
