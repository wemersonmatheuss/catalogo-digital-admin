import fs from 'node:fs';
import path from 'node:path';

import type { CartRepository } from './cart.repository.js';
import type { Cart, CartItem } from './cart.types.js';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export class JsonCartRepository implements CartRepository {
  constructor(private readonly file: string) {}

  async save(items: CartItem[]): Promise<Cart> {
    const carts = this.readAll();
    const cart: Cart = {
      id: nextId(carts),
      createdAt: new Date().toISOString(),
      items,
    };
    carts.unshift(cart);
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(carts, null, 2));
    return cart;
  }

  async find(id: string): Promise<Cart | null> {
    const code = id.trim().toUpperCase();
    return this.readAll().find((cart) => cart.id === code) ?? null;
  }

  private readAll(): Cart[] {
    if (!fs.existsSync(this.file)) {
      return [];
    }
    const data = JSON.parse(fs.readFileSync(this.file, 'utf8')) as unknown;
    return Array.isArray(data) ? (data as Cart[]) : [];
  }
}

function nextId(carts: Cart[]): string {
  let id = '';
  do {
    id = 'SV-';
    for (let index = 0; index < 6; index += 1) {
      id += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  } while (carts.some((cart) => cart.id === id));
  return id;
}
