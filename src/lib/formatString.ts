export const formatString = (str: string) => {
  if (!str) return "";

  return str

    .replace(/_/g, " ")

    .toLowerCase()

    .replace(/\b\w/g, (char) => char.toUpperCase());
};
