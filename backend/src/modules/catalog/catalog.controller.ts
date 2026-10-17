import type { IncomingMessage, ServerResponse } from 'node:http';

import { HttpError, readBody, send } from '../../shared/http/response.js';
import { CatalogService } from './catalog.service.js';

export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      if (req.method === 'GET') {
        send(res, 200, await this.service.getCatalog());
        return;
      }
      if (req.method === 'PUT') {
        send(res, 200, await this.service.replaceCatalog(await readBody(req)));
        return;
      }
      send(res, 404, { message: 'Rota não encontrada.' });
    } catch (error) {
      fail(res, error);
    }
  }
}

function fail(res: ServerResponse, error: unknown): void {
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
