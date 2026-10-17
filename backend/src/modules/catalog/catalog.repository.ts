import type { CatalogSnapshot } from './catalog.types.js';

export interface CatalogRepository {
  read(): Promise<CatalogSnapshot>;
  write(snapshot: CatalogSnapshot): Promise<CatalogSnapshot>;
}
