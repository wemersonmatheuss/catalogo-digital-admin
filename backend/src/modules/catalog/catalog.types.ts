export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  gender: string;
  categoryId: string;
  sizes: string[];
  colors: string[];
  images: ProductImage[];
  available: boolean;
  featured: boolean;
  sku?: string;
  stock?: number;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  placement: string;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogSnapshot {
  categories: Category[];
  products: Product[];
  banners: Banner[];
}
