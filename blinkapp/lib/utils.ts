export function currency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

export function nowIso() {
  return new Date().toISOString();
}

export function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function nextRandomMonthlyDate(from = new Date()) {
  const next = addDays(from, 28 + Math.floor(Math.random() * 7));
  next.setHours(10 + Math.floor(Math.random() * 8), 0, 0, 0);
  return next.toISOString();
}
