import { PrismaClient, type Prisma } from '@prisma/client';

import type { CatalogRepository } from './catalog.repository.js';
import type { Banner, CatalogSnapshot, Category, Product, ProductImage } from './catalog.types.js';

const prisma = new PrismaClient();

export class PrismaCatalogRepository implements CatalogRepository {
  async read(): Promise<CatalogSnapshot> {
    const [categories, products, banners] = await Promise.all([
      prisma.category.findMany(),
      prisma.product.findMany(),
      prisma.banner.findMany(),
    ]);
    return {
      categories: categories.map(toCategory),
      products: products.map(toProduct),
      banners: banners.map(toBanner),
    };
  }

  async write(snapshot: CatalogSnapshot): Promise<CatalogSnapshot> {
    await prisma.$transaction(async (tx) => {
      await tx.product.deleteMany();
      await tx.banner.deleteMany();
      await tx.category.deleteMany();
      if (snapshot.categories.length) {
        await tx.category.createMany({ data: snapshot.categories.map(fromCategory) });
      }
      if (snapshot.products.length) {
        await tx.product.createMany({ data: snapshot.products.map(fromProduct) });
      }
      if (snapshot.banners.length) {
        await tx.banner.createMany({ data: snapshot.banners.map(fromBanner) });
      }
    });
    return snapshot;
  }
}

function toCategory(row: {
  id: string;
  name: string;
  slug: string;
  gender: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): Category {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

function toProduct(row: {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: Prisma.Decimal;
  compareAtPrice: Prisma.Decimal | null;
  gender: string;
  categoryId: string;
  sizes: string[];
  colors: string[];
  images: Prisma.JsonValue;
  available: boolean;
  featured: boolean;
  sku: string | null;
  stock: number | null;
  displayOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
}): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    compareAtPrice: row.compareAtPrice == null ? undefined : Number(row.compareAtPrice),
    gender: row.gender,
    categoryId: row.categoryId,
    sizes: row.sizes,
    colors: row.colors,
    images: (row.images as unknown as ProductImage[]) ?? [],
    available: row.available,
    featured: row.featured,
    sku: row.sku ?? undefined,
    stock: row.stock ?? undefined,
    displayOrder: row.displayOrder ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toBanner(row: {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  placement: string;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}): Banner {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

function fromCategory(category: Category): Prisma.CategoryCreateManyInput {
  return {
    ...category,
    createdAt: new Date(category.createdAt),
    updatedAt: new Date(category.updatedAt),
  };
}

function fromProduct(product: Product): Prisma.ProductCreateManyInput {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    gender: product.gender,
    categoryId: product.categoryId,
    sizes: product.sizes,
    colors: product.colors,
    images: product.images as unknown as Prisma.InputJsonValue,
    available: product.available,
    featured: product.featured,
    sku: product.sku,
    stock: product.stock,
    displayOrder: product.displayOrder,
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt),
  };
}

function fromBanner(banner: Banner): Prisma.BannerCreateManyInput {
  return {
    ...banner,
    createdAt: new Date(banner.createdAt),
    updatedAt: new Date(banner.updatedAt),
  };
}
