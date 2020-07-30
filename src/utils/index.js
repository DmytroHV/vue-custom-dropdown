// eslint-disable-next-line import/prefer-default-export
export const sanitizeString = (string) => {
  if (!string) return '';

  return string.trim().toLowerCase();
};
