export const isDateValid = (date: Date): boolean => {
  return typeof date.toString() === 'string';
};
