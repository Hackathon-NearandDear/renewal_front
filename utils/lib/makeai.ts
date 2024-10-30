export const sanitizeAIName = (value: string): string => {
  return value.replace(/\s+/g, "_").slice(0, 20);
};

export const limitContentLength = (value: string): string => {
  return value.slice(0, 1000);
};
