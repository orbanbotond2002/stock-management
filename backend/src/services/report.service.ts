import * as reportRepo from '../repositories/report.repository.js';

export const getStockOnHand = async () => {
  return reportRepo.findAllStockWithDetails();
};