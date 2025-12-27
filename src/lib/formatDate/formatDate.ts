export const formatDate = (iso: string) => {
  if (!iso) return "";

  const d = new Date(iso);

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
