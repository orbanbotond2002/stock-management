import { prisma } from '../db/prisma.js';

export const findAllStockWithDetails = () => 
  prisma.stock.findMany({
    include: {
      product: { 
        select: { 
          sku: true, 
          name: true 
        } 
      },
      warehouse: { 
        select: { 
          name: true, 
          location: true 
        } 
      }
    },
    orderBy: [
      { warehouse: { name: 'asc' } },
      { product: { name: 'asc' } }
    ]
  });