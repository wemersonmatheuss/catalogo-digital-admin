import { HttpError } from '../../shared/http/response.js';
import type { CartRepository } from './cart.repository.js';
import type { Cart, CartItem } from './cart.types.js';

export class CartService {
  constructor(private readonly repository: CartRepository) {}

  async create(body: unknown): Promise<Cart> {
    const items = normalizeItems(body);
    if (!items?.length) {
      throw new HttpError(400, 'O carrinho precisa ter ao menos uma peça.');
    }
    return this.repository.save(items);
  }

  async find(id: string): Promise<Cart> {
    const cart = await this.repository.find(id);
    if (!cart) {
      throw new HttpError(404, 'Carrinho não encontrado.');
    }
    return cart;
  }
}

function normalizeItems(body: unknown): CartItem[] | null {
  const items = body && typeof body === 'object' ? (body as { items?: unknown }).items : undefined;
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  return items
    .map((item) => {
      const entry = item as Record<string, unknown>;
      return {
        productId: String(entry.productId ?? ''),
        name: String(entry.name ?? ''),
        price: Number(entry.price ?? 0),
        size: entry.size ? String(entry.size) : null,
        color: entry.color ? String(entry.color) : null,
        imageUrl: entry.imageUrl ? String(entry.imageUrl) : '',
      };
    })
    .filter((item) => item.productId && item.name);
}
