export const isExpired = (expirationDate: string | null) => {
  if (expirationDate === null) return false;

  const now = new Date();
  const expiration = new Date(expirationDate);

  return now > expiration;
};
