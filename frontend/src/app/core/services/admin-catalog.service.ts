import { Injectable, computed, inject } from '@angular/core';

import { Banner, BannerPlacement, Category, Gender, Product, ProductImage } from '../models/catalog.models';
import { SiteContent, defaultSiteContent } from '../models/site-content';
import { slugify } from '../utils/slug';
import { CatalogStore } from './catalog-store';

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  gender: Gender;
  categoryId: string;
  sizes: string[];
  colors: string[];
  imageUrls: string[];
  available: boolean;
  featured: boolean;
}

export interface CategoryInput {
  name: string;
  gender: Gender;
  status: Category['status'];
}

export interface BannerInput {
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  placement: BannerPlacement;
  active: boolean;
  displayOrder: number;
}

export type ActionResult = { ok: true; message: string } | { ok: false; message: string };

@Injectable({ providedIn: 'root' })
export class AdminCatalogService {
  private readonly store = inject(CatalogStore);

  readonly categories = computed(() => this.store.snapshot().categories);
  readonly products = computed(() => this.store.snapshot().products);
  readonly banners = computed(() => this.store.snapshot().banners ?? []);
  readonly content = computed(() => this.store.snapshot().content ?? defaultSiteContent());

  readonly stats = computed(() => {
    const products = this.products();
    const categories = this.categories();
    return {
      products: products.length,
      available: products.filter((product) => product.available).length,
      unavailable: products.filter((product) => !product.available).length,
      categories: categories.filter((category) => category.status === 'active').length,
      female: products.filter((product) => product.gender === 'female').length,
      male: products.filter((product) => product.gender === 'male').length,
    };
  });

  productById(id: string): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  categoryById(id: string): Category | undefined {
    return this.categories().find((category) => category.id === id);
  }

  categoriesFor(gender: Gender): Category[] {
    return this.categories().filter((category) => category.gender === gender && category.status === 'active');
  }

  productCount(categoryId: string): number {
    return this.products().filter((product) => product.categoryId === categoryId).length;
  }

  saveProduct(input: ProductInput, id?: string): ActionResult {
    const name = input.name.trim();
    if (!name) {
      return { ok: false, message: 'Informe o nome da peça.' };
    }
    if (!Number.isFinite(input.price) || input.price <= 0) {
      return { ok: false, message: 'Informe um preço maior que zero.' };
    }
    const category = this.categoryById(input.categoryId);
    const current = id ? this.productById(id) : undefined;
    if (!category || category.gender !== input.gender) {
      return { ok: false, message: 'Escolha uma categoria deste segmento.' };
    }
    if (category.status !== 'active' && category.id !== current?.categoryId) {
      return { ok: false, message: 'Escolha uma categoria ativa deste segmento.' };
    }
    if (input.sizes.length === 0 || input.colors.length === 0 || input.imageUrls.length === 0) {
      return { ok: false, message: 'Informe tamanhos, cores e ao menos uma imagem.' };
    }

    const slug = this.uniqueProductSlug(slugify(name) || 'peca', id);
    const now = new Date().toISOString();
    const product: Product = {
      id: current?.id ?? `prod-${crypto.randomUUID()}`,
      name,
      slug,
      description: input.description.trim(),
      price: roundPrice(input.price),
      gender: input.gender,
      categoryId: input.categoryId,
      sizes: input.sizes,
      colors: input.colors,
      images: toImages(name, input.imageUrls),
      available: input.available,
      featured: input.featured,
      compareAtPrice: current?.compareAtPrice,
      sku: current?.sku,
      stock: current?.stock,
      displayOrder: current?.displayOrder,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    };

    const products = id
      ? this.products().map((item) => (item.id === id ? product : item))
      : [product, ...this.products()];
    this.write({ products });
    return { ok: true, message: id ? 'Peça atualizada.' : 'Peça cadastrada.' };
  }

  setAvailability(id: string, available: boolean): ActionResult {
    const products = this.products().map((product) =>
      product.id === id ? { ...product, available, updatedAt: new Date().toISOString() } : product,
    );
    this.write({ products });
    return { ok: true, message: available ? 'Peça reativada.' : 'Peça marcada como indisponível.' };
  }

  deleteProduct(id: string): ActionResult {
    this.write({
      products: this.products().filter((product) => product.id !== id),
    });
    return { ok: true, message: 'Peça excluída.' };
  }

  saveCategory(input: CategoryInput, id?: string): ActionResult {
    const name = input.name.trim();
    if (!name) {
      return { ok: false, message: 'Informe o nome da categoria.' };
    }
    const slug = slugify(name);
    if (!slug) {
      return { ok: false, message: 'O nome precisa gerar um endereço válido.' };
    }
    const duplicate = this.categories().some(
      (category) => category.id !== id && category.gender === input.gender && category.slug === slug,
    );
    if (duplicate) {
      return { ok: false, message: 'Já existe uma categoria com esse nome neste segmento.' };
    }

    const now = new Date().toISOString();
    const current = id ? this.categoryById(id) : undefined;
    const category: Category = {
      id: current?.id ?? `cat-${crypto.randomUUID()}`,
      name,
      slug,
      gender: input.gender,
      status: input.status,
      displayOrder: current?.displayOrder,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    };

    const categories = id
      ? this.categories().map((item) => (item.id === id ? category : item))
      : [...this.categories(), category];
    const products =
      current && current.gender !== category.gender
        ? this.products().map((product) =>
            product.categoryId === category.id ? { ...product, gender: category.gender, updatedAt: now } : product,
          )
        : this.products();

    this.write({ categories, products });
    return { ok: true, message: id ? 'Categoria atualizada.' : 'Categoria criada.' };
  }

  setCategoryStatus(id: string, status: Category['status']): ActionResult {
    const now = new Date().toISOString();
    const categories = this.categories().map((category) =>
      category.id === id ? { ...category, status, updatedAt: now } : category,
    );
    this.write({ categories });
    return { ok: true, message: status === 'active' ? 'Categoria ativada.' : 'Categoria desativada.' };
  }

  deleteCategory(id: string): ActionResult {
    if (this.productCount(id) > 0) {
      return {
        ok: false,
        message: 'Esta categoria tem peças vinculadas. Mova ou exclua essas peças antes de excluir a categoria.',
      };
    }
    this.write({
      categories: this.categories().filter((category) => category.id !== id),
    });
    return { ok: true, message: 'Categoria excluída.' };
  }

  bannerById(id: string): Banner | undefined {
    return this.banners().find((banner) => banner.id === id);
  }

  saveBanner(input: BannerInput, id?: string): ActionResult {
    const title = input.title.trim();
    const imageUrl = input.imageUrl.trim();
    if (!title) {
      return { ok: false, message: 'Informe o título do banner.' };
    }
    if (!imageUrl) {
      return { ok: false, message: 'Informe a imagem do banner.' };
    }

    const now = new Date().toISOString();
    const current = id ? this.bannerById(id) : undefined;
    const banner: Banner = {
      id: current?.id ?? `banner-${crypto.randomUUID()}`,
      title,
      subtitle: input.subtitle.trim(),
      imageUrl,
      link: input.link.trim() || '/produtos',
      placement: input.placement,
      active: input.active,
      displayOrder: Number.isFinite(input.displayOrder) ? input.displayOrder : 1,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    };
    const banners = id
      ? this.banners().map((item) => (item.id === id ? banner : item))
      : [...this.banners(), banner];
    this.write({ banners });
    return { ok: true, message: id ? 'Banner atualizado.' : 'Banner cadastrado.' };
  }

  deleteBanner(id: string): ActionResult {
    this.write({ banners: this.banners().filter((banner) => banner.id !== id) });
    return { ok: true, message: 'Banner excluído.' };
  }

  saveContent(content: SiteContent): void {
    this.write({ content });
  }

  moveProduct(id: string, direction: -1 | 1, visibleIds?: string[]): ActionResult {
    const products = reorder(this.products(), id, direction, visibleIds, (item) => item.displayOrder ?? Number.MAX_SAFE_INTEGER);
    if (!products) {
      return { ok: false, message: 'Essa peça já está no limite da lista.' };
    }
    this.write({ products });
    return { ok: true, message: 'Ordem dos produtos atualizada.' };
  }

  moveCategory(id: string, direction: -1 | 1): ActionResult {
    const categories = reorder(this.categories(), id, direction, undefined, (item) => item.displayOrder ?? Number.MAX_SAFE_INTEGER);
    if (!categories) {
      return { ok: false, message: 'Essa categoria já está no limite da lista.' };
    }
    this.write({ categories });
    return { ok: true, message: 'Ordem das categorias atualizada.' };
  }

  moveBanner(id: string, direction: -1 | 1): ActionResult {
    const current = this.bannerById(id);
    if (!current) {
      return { ok: false, message: 'Banner não encontrado.' };
    }
    const samePlace = this.banners().filter((banner) => banner.placement === current.placement);
    const moved = reorder(samePlace, id, direction, undefined, (item) => item.displayOrder);
    if (!moved) {
      return { ok: false, message: 'Esse banner já está no limite do grupo.' };
    }
    const byId = new Map(moved.map((banner) => [banner.id, banner]));
    this.write({ banners: this.banners().map((banner) => byId.get(banner.id) ?? banner) });
    return { ok: true, message: 'Ordem dos banners atualizada.' };
  }

  patchBannerText(id: string, title: string, subtitle: string): void {
    const banners = this.banners().map((banner) =>
      banner.id === id ? { ...banner, title, subtitle, updatedAt: new Date().toISOString() } : banner,
    );
    this.write({ banners });
  }

  private write(next: {
    categories?: Category[];
    products?: Product[];
    banners?: Banner[];
    content?: SiteContent;
  }): void {
    this.store.replace({
      categories: next.categories ?? this.categories(),
      products: next.products ?? this.products(),
      banners: next.banners ?? this.banners(),
      content: next.content ?? this.content(),
    });
  }

  private uniqueProductSlug(base: string, ignoreId?: string): string {
    const taken = takenProductSlugs(this.products(), ignoreId);
    if (!taken.has(base)) {
      return base;
    }
    let index = 2;
    while (taken.has(`${base}-${index}`)) {
      index += 1;
    }
    return `${base}-${index}`;
  }
}

function toImages(name: string, urls: string[]): ProductImage[] {
  return urls.map((url, index) => ({
    url,
    alt: index === 0 ? `Imagem principal: ${name}` : `Imagem ${index + 1}: ${name}`,
    isPrimary: index === 0,
  }));
}

function roundPrice(value: number): number {
  return Math.round(value * 100) / 100;
}

function takenProductSlugs(products: Product[], ignoreId?: string): Set<string> {
  return new Set(products.filter((product) => product.id !== ignoreId).map((product) => product.slug));
}

function reorder<T extends { id: string }>(
  items: T[],
  id: string,
  direction: -1 | 1,
  visibleIds: string[] | undefined,
  orderOf: (item: T) => number,
): T[] | null {
  const sorted = [...items].sort((a, b) => orderOf(a) - orderOf(b) || a.id.localeCompare(b.id));
  const pool = visibleIds ? sorted.filter((item) => visibleIds.includes(item.id)) : sorted;
  const from = pool.findIndex((item) => item.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= pool.length) {
    return null;
  }
  const nextPool = pool.slice();
  const [item] = nextPool.splice(from, 1);
  nextPool.splice(to, 0, item);
  const slots = pool.map((entry) => sorted.indexOf(entry));
  const next = sorted.slice();
  slots.forEach((slot, index) => {
    next[slot] = nextPool[index];
  });
  return next.map((entry, index) => ({ ...entry, displayOrder: index }));
}
