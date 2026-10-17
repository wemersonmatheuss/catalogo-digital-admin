import path from 'node:path';

import { env } from '../../config/env.js';
import { JsonCartRepository } from '../../modules/carts/json-cart.repository.js';
import type { CartRepository } from '../../modules/carts/cart.repository.js';
import { JsonCatalogRepository } from '../../modules/catalog/json-catalog.repository.js';
import type { CatalogRepository } from '../../modules/catalog/catalog.repository.js';

export async function createRepositories(root: string): Promise<{
  catalog: CatalogRepository;
  carts: CartRepository;
  driver: 'prisma' | 'json';
}> {
  if (env.databaseUrl) {
    const { PrismaCatalogRepository } = await import('../../modules/catalog/prisma-catalog.repository.js');
    const { PrismaCartRepository } = await import('../../modules/carts/prisma-cart.repository.js');
    return {
      catalog: new PrismaCatalogRepository(),
      carts: new PrismaCartRepository(),
      driver: 'prisma',
    };
  }

  return {
    catalog: new JsonCatalogRepository(path.join(root, 'data', 'catalog.json')),
    carts: new JsonCartRepository(path.join(root, 'data', 'carts.json')),
    driver: 'json',
  };
}
