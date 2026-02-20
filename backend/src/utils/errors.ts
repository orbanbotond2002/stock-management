export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const notFound = (resource: string) =>
  new AppError(404, 'NOT_FOUND', `${resource} not found`);

export const validationError = (message: string) =>
  new AppError(400, 'VALIDATION_ERROR', message);

export const forbidden = () =>
  new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action');

export const authenticationError = () =>
  new AppError(401, 'UNAUTHORIZED', 'Invalid or missing token');

export const conflict = (message: string) =>
  new AppError(409, 'CONFLICT', message);

export const insufficientStock = () =>
  new AppError(400, 'INSUFFICIENT_STOCK', 'Not enough stock in warehouse');

export const invalidTransfer = () =>
  new AppError(400, 'INVALID_TRANSFER', 'Source and target warehouse cannot be the same');