export type Gender = 'female' | 'male';

export type CatalogStatus = 'active' | 'inactive';

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: Gender;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  gender: Gender;
  categoryId: string;
  sizes: string[];
  colors: string[];
  images: ProductImage[];
  available: boolean;
  featured: boolean;
  compareAtPrice?: number;
  sku?: string;
  stock?: number;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  gender?: Gender;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export type BannerPlacement = 'hero' | 'middle';

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  placement: BannerPlacement;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogView<T> {
  status: 'loading' | 'ready' | 'error';
  data: T;
}

export interface CatalogSnapshot {
  categories: Category[];
  products: Product[];
  banners: Banner[];
}
