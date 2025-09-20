export const apiResponseSuccess = (status?: number) => {
  return status && status >= 200 && status <= 300;
};
