export function isNonEmptyString(v: any): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function isPositiveNumber(v: any): v is number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0;
}
