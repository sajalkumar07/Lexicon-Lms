// Utils/helpers.js

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "N/A";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", defaultOptions);
  } catch (e) {
    console.error("Error formatting date:", e);
    return "N/A";
  }
};

/**
 * Format a currency value
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "INR") => {
  if (amount === undefined || amount === null) return "N/A";

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const symbol = currencySymbols[currency] || "";

  return `${symbol}${Number(amount).toLocaleString()}`;
};
