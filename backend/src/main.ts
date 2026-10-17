import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createServer } from './app.js';
import { env } from './config/env.js';
import { createRepositories } from './infrastructure/persistence/repositories.js';
import { CartController } from './modules/carts/cart.controller.js';
import { CartService } from './modules/carts/cart.service.js';
import { CatalogController } from './modules/catalog/catalog.controller.js';
import { CatalogService } from './modules/catalog/catalog.service.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositories = await createRepositories(root);
const catalog = new CatalogController(new CatalogService(repositories.catalog));
const carts = new CartController(new CartService(repositories.carts));

createServer(catalog, carts).listen(env.port, () => {
  const storage = repositories.driver === 'prisma' ? 'PostgreSQL via Prisma' : 'arquivo local';
  console.log(`API em http://localhost:${env.port} (${storage})`);
});
