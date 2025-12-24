import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format date and time to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date-time string
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

/**
 * Format number as currency (Indian Rupees)
 * @param {number} amount - Amount to format
 * @param {boolean} compact - Whether to use compact notation
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, compact = false) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  
  if (compact) {
    return formatCompactCurrency(amount);
  }
  
  return `₹${amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format number as compact currency (1M, 1.5M, etc.)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted compact currency string
 */
export const formatCompactCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 10000000) {
    // Crores (10 million)
    return `${sign}₹${(absAmount / 10000000).toFixed(1)}Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs (100 thousand)
    return `${sign}₹${(absAmount / 100000).toFixed(1)}L`;
  } else if (absAmount >= 1000) {
    // Thousands
    return `${sign}₹${(absAmount / 1000).toFixed(1)}K`;
  }
  
  return `${sign}₹${absAmount.toFixed(0)}`;
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {boolean} compact - Whether to use compact notation
 * @returns {string} Formatted number string
 */
export const formatNumber = (num, compact = false) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  if (compact) {
    return formatCompactNumber(num);
  }
  
  return num.toLocaleString('en-IN');
};

/**
 * Format number in compact notation (1K, 1.5M, etc.)
 * @param {number} num - Number to format
 * @returns {string} Formatted compact number string
 */
export const formatCompactNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 10000000) {
    // Crores (10 million)
    return `${sign}${(absNum / 10000000).toFixed(1)}Cr`;
  } else if (absNum >= 100000) {
    // Lakhs (100 thousand)
    return `${sign}${(absNum / 100000).toFixed(1)}L`;
  } else if (absNum >= 1000) {
    // Thousands
    return `${sign}${(absNum / 1000).toFixed(1)}K`;
  }
  
  return `${sign}${absNum}`;
};

/**
 * Format file size in bytes to readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format transaction type to readable label
 * @param {string} type - Transaction type enum
 * @returns {string} Formatted label
 */
export const formatTransactionType = (type) => {
  const types = {
    STOCK_IN: 'Stock In',
    STOCK_OUT: 'Stock Out',
    TRANSFER: 'Transfer',
    ADJUSTMENT: 'Adjustment',
  };
  return types[type] || type;
};

/**
 * Format status to readable label
 * @param {string|boolean} status - Status value
 * @returns {string} Formatted status
 */
export const formatStatus = (status) => {
  if (typeof status === 'boolean') {
    return status ? 'Active' : 'Inactive';
  }
  return capitalize(status);
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
