export const getCookies = () => {
  const queryString = document.cookie.replace(/\;\s?/g, '&');
  const cookies = new URLSearchParams(queryString);
  return Object.fromEntries(cookies.entries());
};
