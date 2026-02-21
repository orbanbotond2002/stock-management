import * as warehouseRepo from '../repositories/warehouse.repository.js';
import { conflict, notFound } from '../utils/errors.js';

export const getAllWarehouses = () => warehouseRepo.findAllWarehouses();

export const getWarehouseById = async (id: string) => {
  const warehouse = await warehouseRepo.findWarehouseById(id);
  if (!warehouse) throw notFound('Warehouse');
  return warehouse;
};

export const createWarehouse = (data: { name: string; location?: string }) =>
  warehouseRepo.createWarehouse(data);

export const updateWarehouse = async (
  id: string,
  data: { name?: string; location?: string }
) => {
  await getWarehouseById(id);
  return warehouseRepo.updateWarehouse(id, data);
};

export const deleteWarehouse = async (id: string) => {
  const warehouse = await getWarehouseById(id);

  if (warehouse.stocks && warehouse.stocks.length > 0) {
    throw conflict('Cannot delete warehouse because it contains active stock');
  }

  return warehouseRepo.deleteWarehouse(id);
};
