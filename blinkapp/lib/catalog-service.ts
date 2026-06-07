import { getState } from "./mock-store";

export function listCatalogItems() {
  return getState().catalog;
}

export function findCatalogItem(itemId: string) {
  return getState().catalog.find((item) => item.id === itemId) ?? null;
}
