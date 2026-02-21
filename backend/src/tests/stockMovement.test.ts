import { describe, it, expect, vi } from 'vitest';
import { processOutMovement } from '../services/stockMovement.service.js';
import type { Mock } from 'vitest';

vi.mock('../repositories/stockMovement.repository.js', () => ({
  findStockByProductAndWarehouse: vi.fn().mockResolvedValue({ quantity: 10 }),
  createOutMovement: vi.fn().mockResolvedValue({ id: '1', type: 'OUT' }),
  decrementStock: vi.fn().mockResolvedValue({}),
}));

vi.mock('../db/prisma.js', () => ({
  prisma: {
    $transaction: vi.fn((fn: (tx: object) => unknown) =>
      fn({
        stockMovement: { create: vi.fn().mockResolvedValue({ id: '1' }) },
        stock: { update: vi.fn().mockResolvedValue({}) },
      })
    ),
  },
}));

describe('OUT movement', () => {
  it('should throw INSUFFICIENT_STOCK if quantity exceeds stock', async () => {
    const { findStockByProductAndWarehouse } =
      await import('../repositories/stockMovement.repository.js');
    (findStockByProductAndWarehouse as Mock).mockResolvedValueOnce({
      quantity: 5,
    });

    await expect(
      processOutMovement({
        productId: 'product-1',
        sourceWarehouseId: 'warehouse-1',
        quantity: 10,
        createdBy: 'user-1',
      })
    ).rejects.toMatchObject({ code: 'INSUFFICIENT_STOCK' });
  });

  it('should throw INSUFFICIENT_STOCK if no stock exists', async () => {
    const { findStockByProductAndWarehouse } =
      await import('../repositories/stockMovement.repository.js');
    (findStockByProductAndWarehouse as Mock).mockResolvedValueOnce(null);

    await expect(
      processOutMovement({
        productId: 'product-1',
        sourceWarehouseId: 'warehouse-1',
        quantity: 1,
        createdBy: 'user-1',
      })
    ).rejects.toMatchObject({ code: 'INSUFFICIENT_STOCK' });
  });

  it('should process OUT movement successfully if stock is sufficient', async () => {
    const { findStockByProductAndWarehouse } =
      await import('../repositories/stockMovement.repository.js');
    (findStockByProductAndWarehouse as Mock).mockResolvedValueOnce({
      quantity: 10,
    });

    const result = await processOutMovement({
      productId: 'product-1',
      sourceWarehouseId: 'warehouse-1',
      quantity: 5,
      createdBy: 'user-1',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.type).toBe('OUT');

    expect(findStockByProductAndWarehouse).toHaveBeenCalledWith(
      'product-1',
      'warehouse-1'
    );
  });
});
