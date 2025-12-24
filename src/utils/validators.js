/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate SKU format
 * @param {string} sku - SKU to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateSKU = (sku) => {
  if (!sku || sku.trim().length === 0) {
    return { isValid: false, error: 'SKU is required' };
  }
  if (sku.length > 50) {
    return { isValid: false, error: 'SKU must be 50 characters or less' };
  }
  // Allow alphanumeric, hyphens, and underscores
  const skuRegex = /^[A-Za-z0-9_-]+$/;
  if (!skuRegex.test(sku)) {
    return { isValid: false, error: 'SKU can only contain letters, numbers, hyphens, and underscores' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate product data
 * @param {object} product - Product data to validate
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateProduct = (product) => {
  const errors = {};

  // Name validation
  if (!product.name || product.name.trim().length === 0) {
    errors.name = 'Product name is required';
  } else if (product.name.length > 200) {
    errors.name = 'Name must be 200 characters or less';
  }

  // SKU validation
  const skuValidation = validateSKU(product.sku);
  if (!skuValidation.isValid) {
    errors.sku = skuValidation.error;
  }

  // Category validation
  if (!product.category || product.category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  // Price validation
  if (!product.price || product.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  // Cost validation
  if (!product.cost || product.cost <= 0) {
    errors.cost = 'Cost must be greater than 0';
  }

  // Minimum stock level validation
  if (product.minimum_stock_level !== undefined && product.minimum_stock_level < 0) {
    errors.minimum_stock_level = 'Minimum stock level cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate warehouse data
 * @param {object} warehouse - Warehouse data to validate
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateWarehouse = (warehouse) => {
  const errors = {};

  // Name validation
  if (!warehouse.name || warehouse.name.trim().length === 0) {
    errors.name = 'Warehouse name is required';
  } else if (warehouse.name.length > 255) {
    errors.name = 'Name must be 255 characters or less';
  }

  // Code validation
  if (!warehouse.code || warehouse.code.trim().length === 0) {
    errors.code = 'Warehouse code is required';
  } else if (warehouse.code.length > 20) {
    errors.code = 'Code must be 20 characters or less';
  }

  // Location validation
  if (!warehouse.location || warehouse.location.trim().length === 0) {
    errors.location = 'Location is required';
  }

  // Capacity validation
  if (!warehouse.capacity || warehouse.capacity <= 0) {
    errors.capacity = 'Capacity must be greater than 0';
  }

  // Email validation (if provided)
  if (warehouse.contact_email && !isValidEmail(warehouse.contact_email)) {
    errors.contact_email = 'Invalid email format';
  }

  // Phone validation (if provided)
  if (warehouse.contact_phone && !isValidPhone(warehouse.contact_phone)) {
    errors.contact_phone = 'Invalid phone number format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate inventory data
 * @param {object} inventory - Inventory data to validate
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateInventory = (inventory) => {
  const errors = {};

  // Product ID validation
  if (!inventory.product_id) {
    errors.product_id = 'Product is required';
  }

  // Warehouse ID validation
  if (!inventory.warehouse_id) {
    errors.warehouse_id = 'Warehouse is required';
  }

  // Quantity validation
  if (inventory.quantity === undefined || inventory.quantity < 0) {
    errors.quantity = 'Quantity cannot be negative';
  }

  // Minimum stock validation
  if (inventory.minimum_stock !== undefined && inventory.minimum_stock < 0) {
    errors.minimum_stock = 'Minimum stock cannot be negative';
  }

  // Maximum stock validation
  if (inventory.maximum_stock !== undefined && inventory.maximum_stock < 0) {
    errors.maximum_stock = 'Maximum stock cannot be negative';
  }

  // Min/Max comparison
  if (
    inventory.minimum_stock !== undefined &&
    inventory.maximum_stock !== undefined &&
    inventory.minimum_stock > inventory.maximum_stock
  ) {
    errors.maximum_stock = 'Maximum stock must be greater than minimum stock';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate transaction data
 * @param {object} transaction - Transaction data to validate
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateTransaction = (transaction) => {
  const errors = {};

  // Product ID validation
  if (!transaction.product_id) {
    errors.product_id = 'Product is required';
  }

  // Warehouse ID validation
  if (!transaction.warehouse_id && transaction.transaction_type !== 'TRANSFER') {
    errors.warehouse_id = 'Warehouse is required';
  }

  // Transfer specific validations
  if (transaction.transaction_type === 'TRANSFER') {
    if (!transaction.from_warehouse_id) {
      errors.from_warehouse_id = 'Source warehouse is required';
    }
    if (!transaction.to_warehouse_id) {
      errors.to_warehouse_id = 'Destination warehouse is required';
    }
    if (transaction.from_warehouse_id === transaction.to_warehouse_id) {
      errors.to_warehouse_id = 'Source and destination warehouses must be different';
    }
  }

  // Quantity validation
  if (!transaction.quantity || transaction.quantity <= 0) {
    errors.quantity = 'Quantity must be greater than 0';
  }

  // Reason validation (for adjustments)
  if (transaction.transaction_type === 'ADJUSTMENT' && !transaction.reason) {
    errors.reason = 'Reason is required for adjustments';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  if (typeof value === 'string' && value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRange = (value, min, max, fieldName = 'Value') => {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

/**
 * Validate positive number
 * @param {string|number} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @param {boolean} allowZero - Whether to allow zero as valid
 * @returns {string|null} Error message or null if valid
 */
export const validatePositiveNumber = (value, fieldName = 'This field', allowZero = false) => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (allowZero) {
    if (numValue < 0) {
      return `${fieldName} cannot be negative`;
    }
  } else {
    if (numValue <= 0) {
      return `${fieldName} must be greater than 0`;
    }
  }
  
  return null;
};
