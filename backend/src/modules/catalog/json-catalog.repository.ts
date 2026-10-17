import fs from 'node:fs';
import path from 'node:path';

import { seedCatalog } from '../../../seed.mjs';
import type { CatalogRepository } from './catalog.repository.js';
import type { CatalogSnapshot } from './catalog.types.js';

export class JsonCatalogRepository implements CatalogRepository {
  constructor(private readonly file: string) {}

  async read(): Promise<CatalogSnapshot> {
    if (!fs.existsSync(this.file)) {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      fs.writeFileSync(this.file, JSON.stringify(seedCatalog, null, 2));
    }
    const data = JSON.parse(fs.readFileSync(this.file, 'utf8')) as Partial<CatalogSnapshot>;
    return {
      categories: data.categories ?? [],
      products: data.products ?? [],
      banners: data.banners ?? [],
    };
  }

  async write(snapshot: CatalogSnapshot): Promise<CatalogSnapshot> {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(snapshot, null, 2));
    return snapshot;
  }
}
