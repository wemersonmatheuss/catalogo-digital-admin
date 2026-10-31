import { HttpError } from '../../shared/http/response.js';
import type { CatalogRepository } from './catalog.repository.js';
import type { CatalogSnapshot } from './catalog.types.js';
import { normalizeSiteContent } from './site-content.js';

export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  async getCatalog(): Promise<CatalogSnapshot> {
    const data = await this.repository.read();
    return { ...data, content: normalizeSiteContent(data.content) };
  }

  async replaceCatalog(body: unknown): Promise<CatalogSnapshot> {
    if (!isSnapshot(body)) {
      throw new HttpError(400, 'O catálogo precisa ter categorias, produtos e banners.');
    }
    return this.repository.write({ ...body, content: normalizeSiteContent(body.content) });
  }
}

function isSnapshot(body: unknown): body is CatalogSnapshot {
  if (!body || typeof body !== 'object') {
    return false;
  }
  const data = body as Partial<CatalogSnapshot>;
  return Array.isArray(data.categories) && Array.isArray(data.products) && Array.isArray(data.banners);
}
