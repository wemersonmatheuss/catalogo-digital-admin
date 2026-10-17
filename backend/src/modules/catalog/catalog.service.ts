import { HttpError } from '../../shared/http/response.js';
import type { CatalogRepository } from './catalog.repository.js';
import type { CatalogSnapshot } from './catalog.types.js';

export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  getCatalog(): Promise<CatalogSnapshot> {
    return this.repository.read();
  }

  async replaceCatalog(body: unknown): Promise<CatalogSnapshot> {
    if (!isSnapshot(body)) {
      throw new HttpError(400, 'O catálogo precisa ter categorias, produtos e banners.');
    }
    return this.repository.write(body);
  }
}

function isSnapshot(body: unknown): body is CatalogSnapshot {
  if (!body || typeof body !== 'object') {
    return false;
  }
  const data = body as Partial<CatalogSnapshot>;
  return Array.isArray(data.categories) && Array.isArray(data.products) && Array.isArray(data.banners);
}
