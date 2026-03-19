/** Kenyan phone number (9 digits after +254, starting with 7 or 1) */
export const validateKenyanPhone = (value: string): string => {
  if (!value) return 'Phone number is required';
  if (!/^[71]\d{8}$/.test(value)) return 'Enter a valid Kenyan number (e.g. 712345678)';
  return '';
};

/** Kenyan National ID (7–8 digits) */
export const validateIdNumber = (value: string): string => {
  if (!value) return 'ID number is required';
  if (!/^\d{7,8}$/.test(value)) return 'ID number must be 7–8 digits';
  return '';
};

/** Standard email format */
export const validateEmail = (value: string): string => {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
  return '';
};

/** Positive numeric amount */
export const validateAmount = (value: string): string => {
  if (!value) return 'Amount is required';
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return 'Enter a valid amount';
  return '';
};
