import type { Cart, CartItem } from './cart.types.js';

export interface CartRepository {
  save(items: CartItem[]): Promise<Cart>;
  find(id: string): Promise<Cart | null>;
}
