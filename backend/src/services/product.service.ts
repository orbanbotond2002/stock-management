import * as productRepo from '../repositories/product.repository.js';
import { notFound } from '../utils/errors.js';

export const getAllProducts = (search? : string) => productRepo.findAllProducts(search);

export const getProductById = async (id: string) => {
  const product = await productRepo.findProductById(id);
  if (!product) throw notFound('Product');
  return product;
};

export const createProduct = (data: { sku: string; name: string; description?: string }) =>
  productRepo.createProduct(data);

export const updateProduct = async (id: string, data: { sku?: string; name?: string; description?: string }) => {
  await getProductById(id);
  return productRepo.updateProduct(id, data);
};

export const deleteProduct = async (id: string) => {
  await getProductById(id);
  return productRepo.deleteProduct(id);
};