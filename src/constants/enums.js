// Status Enums
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  STOCK_IN: 'STOCK_IN',
  STOCK_OUT: 'STOCK_OUT',
  TRANSFER: 'TRANSFER',
  ADJUSTMENT: 'ADJUSTMENT',
};

// Transaction Type Labels
export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.STOCK_IN]: 'Stock In',
  [TRANSACTION_TYPES.STOCK_OUT]: 'Stock Out',
  [TRANSACTION_TYPES.TRANSFER]: 'Transfer',
  [TRANSACTION_TYPES.ADJUSTMENT]: 'Adjustment',
};

// Transaction Type Colors
export const TRANSACTION_TYPE_COLORS = {
  [TRANSACTION_TYPES.STOCK_IN]: '#10b981', // Green
  [TRANSACTION_TYPES.STOCK_OUT]: '#ef4444', // Red
  [TRANSACTION_TYPES.TRANSFER]: '#3b82f6', // Blue
  [TRANSACTION_TYPES.ADJUSTMENT]: '#f59e0b', // Amber
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Smartphones',
  'Laptops',
  'Tablets',
  'Accessories',
  'Parts',
  'Other',
];

// Sort Options
export const SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
};
