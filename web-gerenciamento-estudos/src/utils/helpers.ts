export const formatDate = (date: Date, format: string): string => {
  const options: Intl.DateTimeFormatOptions = {};
  
  if (format === 'short') {
    options.year = 'numeric';
    options.month = 'short';
    options.day = 'numeric';
  } else if (format === 'long') {
    options.year = 'numeric';
    options.month = 'long';
    options.day = 'numeric';
    options.weekday = 'long';
  }
  
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateUniqueId = (): string => {
  return 'xxxx-xxxx-4xxx-yxxx-xxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const trimString = (string: string): string => {
  return string.trim();
};

