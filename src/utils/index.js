export const sanitizeString = (string) => {
  if (!string) return '';

  return string.trim().toLowerCase();
};
