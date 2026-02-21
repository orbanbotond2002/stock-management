import { prisma } from '../db/prisma.js';

export const findAllWarehouses = () =>
  prisma.warehouse.findMany({
    include: { stocks: { include: { product: true } } },
  });

export const findWarehouseById = (id: string) =>
  prisma.warehouse.findUnique({
    where: { id },
    include: { stocks: { include: { product: true } } },
  });

export const createWarehouse = (data: { name: string; location?: string }) =>
  prisma.warehouse.create({ data });

export const updateWarehouse = (
  id: string,
  data: { name?: string; location?: string }
) => prisma.warehouse.update({ where: { id }, data });

export const deleteWarehouse = (id: string) =>
  prisma.warehouse.delete({ where: { id } });
