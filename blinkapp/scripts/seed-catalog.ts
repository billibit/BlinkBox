import { listCatalogItems } from "../lib/catalog-service";

console.log(`Seed catalog contains ${listCatalogItems().length} MVP gift item(s).`);
