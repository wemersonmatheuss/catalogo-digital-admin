import { PrismaClient } from '@prisma/client';

import type { CartRepository } from './cart.repository.js';
import type { Cart, CartItem } from './cart.types.js';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const prisma = new PrismaClient();

export class PrismaCartRepository implements CartRepository {
  async save(items: CartItem[]): Promise<Cart> {
    const id = await nextId();
    const created = await prisma.cart.create({
      data: {
        id,
        createdAt: new Date(),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            size: item.size,
            color: item.color,
            imageUrl: item.imageUrl,
          })),
        },
      },
      include: { items: true },
    });
    return toCart(created);
  }

  async find(id: string): Promise<Cart | null> {
    const cart = await prisma.cart.findUnique({
      where: { id: id.trim().toUpperCase() },
      include: { items: true },
    });
    return cart ? toCart(cart) : null;
  }
}

function toCart(cart: {
  id: string;
  createdAt: Date;
  items: { productId: string; name: string; price: { toString(): string }; size: string | null; color: string | null; imageUrl: string }[];
}): Cart {
  return {
    id: cart.id,
    createdAt: cart.createdAt.toISOString(),
    items: cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: Number(item.price),
      size: item.size,
      color: item.color,
      imageUrl: item.imageUrl,
    })),
  };
}

async function nextId(): Promise<string> {
  let id = '';
  do {
    id = 'SV-';
    for (let index = 0; index < 6; index += 1) {
      id += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  } while (await prisma.cart.findUnique({ where: { id } }));
  return id;
}
