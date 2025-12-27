export function safe(value?: string | number | null, fallback = "—") {
  return value ? value : fallback;
}
