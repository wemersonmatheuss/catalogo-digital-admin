import type { IncomingMessage, ServerResponse } from 'node:http';

import { HttpError, readBody, send } from '../../shared/http/response.js';
import { CartService } from './cart.service.js';

export class CartController {
  constructor(private readonly service: CartService) {}

  async handle(req: IncomingMessage, res: ServerResponse, id?: string): Promise<void> {
    try {
      if (!id && req.method === 'POST') {
        send(res, 201, await this.service.create(await readBody(req)));
        return;
      }
      if (id && req.method === 'GET') {
        send(res, 200, await this.service.find(decodeURIComponent(id)));
        return;
      }
      send(res, 404, { message: 'Rota não encontrada.' });
    } catch (error) {
      if (error instanceof HttpError) {
        send(res, error.status, { message: error.message });
        return;
      }
      if (error instanceof SyntaxError) {
        send(res, 400, { message: 'JSON inválido.' });
        return;
      }
      send(res, 500, { message: 'Erro interno.' });
    }
  }
}
