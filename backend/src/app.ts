import http from 'node:http';

import { env } from './config/env.js';
import { CartController } from './modules/carts/cart.controller.js';
import { CatalogController } from './modules/catalog/catalog.controller.js';
import { send } from './shared/http/response.js';

export function createServer(catalog: CatalogController, carts: CartController) {
  return http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      send(res, 204);
      return;
    }

    const url = new URL(req.url ?? '/', `http://localhost:${env.port}`);
    const cartMatch = url.pathname.match(/^\/carts(?:\/([^/]+))?$/);

    if (url.pathname === '/catalog') {
      await catalog.handle(req, res);
      return;
    }

    if (cartMatch) {
      await carts.handle(req, res, cartMatch[1]);
      return;
    }

    send(res, 404, { message: 'Rota não encontrada.' });
  });
}
