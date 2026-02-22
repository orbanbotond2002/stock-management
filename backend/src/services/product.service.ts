import * as productRepo from '../repositories/product.repository.js';
import { conflict, notFound } from '../utils/errors.js';

export const getAllProducts = (search?: string) =>
  productRepo.findAllProducts(search);

export const getProductById = async (id: string) => {
  const product = await productRepo.findProductById(id);
  if (!product) throw notFound('Product');
  return product;
};

export const createProduct = (data: {
  sku: string;
  name: string;
  description?: string;
}) =>
  (async () => {
    const existing = await productRepo.findProductBySku(data.sku);

    if (existing) throw conflict('SKU already exists');
    return productRepo.createProduct(data);
  })();

export const updateProduct = async (
  id: string,
  data: { sku?: string; name?: string; description?: string }
) => {
  const existing = await getProductById(id);
  if (data.sku && data.sku !== existing.sku) {
    const other = await productRepo.findProductBySku(data.sku);

    if (other && other.id !== id) throw conflict('SKU already exists');
  }

  return productRepo.updateProduct(id, data);
};

export const deleteProduct = async (id: string) => {
  const product = await getProductById(id);

  const positiveStocks = product.stocks.filter((s) => s.quantity > 0);
  if (positiveStocks.length > 0) {
    const warehouseNames = Array.from(
      new Set(positiveStocks.map((s) => s.warehouse.name))
    );

    throw conflict(
      `Can\'t delete product. Warehouse(s): ${warehouseNames.join(', ')}`
    );
  }

  const movementCount = await productRepo.countStockMovementsByProductId(id);
  if (movementCount > 0) {
    throw conflict(
      "Can't delete product: there are stock movements for this product."
    );
  }

  await productRepo.deleteStocksByProductId(id);
  return productRepo.deleteProduct(id);
};
