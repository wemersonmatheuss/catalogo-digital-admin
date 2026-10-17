import { Category, Product } from '../models/catalog.models';

/**
 * DADOS DE DEMONSTRAÇÃO.
 * Não são peças reais da Sempre-Viva.
 * Servem apenas para desenvolver e testar o catálogo antes do PostgreSQL.
 * A fonte definitiva será a API, com um único registro de cada produto no banco.
 */

const created = '2026-09-01T12:00:00.000Z';
const updated = '2026-09-20T12:00:00.000Z';

const primary = (name: string) => ({
  url: 'assets/mock/peca.svg',
  alt: `Imagem de demonstração: ${name}`,
  isPrimary: true,
});

const extra = (name: string) => ({
  url: 'assets/mock/peca-extra.svg',
  alt: `Imagem adicional de demonstração: ${name}`,
  isPrimary: false,
});

export const DEMO_CATEGORIES: Category[] = [
  category('cat-f-bermuda', 'Bermuda', 'bermuda', 'female'),
  category('cat-f-calca', 'Calça', 'calca', 'female'),
  category('cat-f-blusa', 'Blusa', 'blusa', 'female'),
  category('cat-f-intima', 'Íntima', 'intima', 'female'),
  category('cat-f-meia-calca', 'Meia-calça', 'meia-calca', 'female'),
  category('cat-f-pijama', 'Pijama', 'pijama', 'female'),
  category('cat-m-intimo', 'Íntimo', 'intimo', 'male'),
  category('cat-m-meia', 'Meia', 'meia', 'male'),
  category('cat-m-pijama', 'Pijama', 'pijama', 'male'),
  category('cat-m-gravata', 'Gravata', 'gravata', 'male'),
  category('cat-m-cinto', 'Cinto', 'cinto', 'male'),
  category('cat-m-bermuda', 'Bermuda', 'bermuda', 'male'),
  category('cat-m-calca', 'Calça', 'calca', 'male'),
  category('cat-m-camiseta', 'Camiseta', 'camiseta', 'male'),
  category('cat-m-roupa', 'Roupa', 'roupa', 'male'),
  category('cat-m-esportiva', 'Esportiva', 'esportiva', 'male'),
  category('cat-m-chapeu', 'Chapéu', 'chapeu', 'male'),
  category('cat-m-terno', 'Terno', 'terno', 'male'),
  category('cat-m-camisa-social', 'Camisa social', 'camisa-social', 'male'),
];

export const DEMO_PRODUCTS: Product[] = [
  product({
    id: 'demo-blusa-linho',
    name: 'Blusa de linho — demonstração',
    slug: 'blusa-de-linho-demonstracao',
    description:
      'Peça fictícia para demonstrar o catálogo. Blusa de modelagem reta, pensada apenas como exemplo de ficha de produto.',
    price: 89.9,
    gender: 'female',
    categoryId: 'cat-f-blusa',
    sizes: ['P', 'M', 'G'],
    colors: ['Off-white', 'Verde musgo'],
    featured: true,
    displayOrder: 1,
    createdAt: '2026-09-18T12:00:00.000Z',
  }),
  product({
    id: 'demo-calca-reta',
    name: 'Calça reta — demonstração',
    slug: 'calca-reta-demonstracao',
    description: 'Peça fictícia. Calça de cintura média usada para testar listagem, preço e tamanhos.',
    price: 149.9,
    gender: 'female',
    categoryId: 'cat-f-calca',
    sizes: ['36', '38', '40', '42'],
    colors: ['Areia', 'Preto'],
    featured: true,
    displayOrder: 2,
    createdAt: '2026-09-12T12:00:00.000Z',
  }),
  product({
    id: 'demo-bermuda-feminina',
    name: 'Bermuda alfaiataria — demonstração',
    slug: 'bermuda-alfaiataria-demonstracao',
    description: 'Peça fictícia de bermuda feminina para demonstrar a categoria Bermuda.',
    price: 99.9,
    gender: 'female',
    categoryId: 'cat-f-bermuda',
    sizes: ['P', 'M', 'G'],
    colors: ['Bege'],
    displayOrder: 3,
    createdAt: '2026-09-08T12:00:00.000Z',
  }),
  product({
    id: 'demo-pijama-feminino',
    name: 'Pijama curto — demonstração',
    slug: 'pijama-curto-demonstracao',
    description: 'Peça fictícia marcada como indisponível para demonstrar o estado de estoque esgotado.',
    price: 79.9,
    gender: 'female',
    categoryId: 'cat-f-pijama',
    sizes: ['P', 'M'],
    colors: ['Rosa queimado'],
    available: false,
    displayOrder: 4,
    createdAt: '2026-09-22T12:00:00.000Z',
  }),
  product({
    id: 'demo-meia-calca',
    name: 'Meia-calça fio 20 — demonstração',
    slug: 'meia-calca-fio-20-demonstracao',
    description: 'Peça fictícia para a categoria Meia-calça. Não representa um produto real da loja.',
    price: 29.9,
    gender: 'female',
    categoryId: 'cat-f-meia-calca',
    sizes: ['Único'],
    colors: ['Preto', 'Natural'],
    displayOrder: 5,
    createdAt: '2026-09-05T12:00:00.000Z',
  }),
  product({
    id: 'demo-camiseta',
    name: 'Camiseta básica — demonstração',
    slug: 'camiseta-basica-demonstracao',
    description: 'Peça fictícia masculina em destaque, usada para testar busca por “camiseta”.',
    price: 59.9,
    gender: 'male',
    categoryId: 'cat-m-camiseta',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Branco', 'Marinho'],
    featured: true,
    displayOrder: 1,
    createdAt: '2026-09-21T12:00:00.000Z',
  }),
  product({
    id: 'demo-camisa-social',
    name: 'Camisa social — demonstração',
    slug: 'camisa-social-demonstracao',
    description: 'Peça fictícia de camisa social para demonstrar a ficha com mais de uma imagem.',
    price: 129.9,
    gender: 'male',
    categoryId: 'cat-m-camisa-social',
    sizes: ['1', '2', '3', '4'],
    colors: ['Branco', 'Azul claro'],
    featured: true,
    extraImage: true,
    displayOrder: 2,
    createdAt: '2026-09-15T12:00:00.000Z',
  }),
  product({
    id: 'demo-cinto',
    name: 'Cinto clássico — demonstração',
    slug: 'cinto-classico-demonstracao',
    description: 'Peça fictícia da categoria Cinto.',
    price: 69.9,
    gender: 'male',
    categoryId: 'cat-m-cinto',
    sizes: ['90', '100', '110'],
    colors: ['Marrom', 'Preto'],
    displayOrder: 3,
    createdAt: '2026-09-03T12:00:00.000Z',
  }),
  product({
    id: 'demo-bermuda-masculina',
    name: 'Bermuda sarja — demonstração',
    slug: 'bermuda-sarja-demonstracao',
    description: 'Peça fictícia para testar a busca pela palavra “bermuda” nos dois segmentos.',
    price: 109.9,
    gender: 'male',
    categoryId: 'cat-m-bermuda',
    sizes: ['38', '40', '42', '44'],
    colors: ['Caqui'],
    displayOrder: 4,
    createdAt: '2026-09-19T12:00:00.000Z',
  }),
  product({
    id: 'demo-gravata',
    name: 'Gravata lisa — demonstração',
    slug: 'gravata-lisa-demonstracao',
    description: 'Peça fictícia indisponível no segmento masculino.',
    price: 49.9,
    gender: 'male',
    categoryId: 'cat-m-gravata',
    sizes: ['Único'],
    colors: ['Vinho'],
    available: false,
    displayOrder: 5,
    createdAt: '2026-09-02T12:00:00.000Z',
  }),
];

function category(
  id: string,
  name: string,
  slug: string,
  gender: Category['gender'],
): Category {
  return {
    id,
    name,
    slug,
    gender,
    status: 'active',
    createdAt: created,
    updatedAt: updated,
  };
}

function product(
  input: Omit<Product, 'images' | 'available' | 'featured' | 'createdAt' | 'updatedAt'> & {
    available?: boolean;
    featured?: boolean;
    extraImage?: boolean;
    createdAt: string;
  },
): Product {
  const images = [primary(input.name)];
  if (input.extraImage) {
    images.push(extra(input.name));
  }

  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    gender: input.gender,
    categoryId: input.categoryId,
    sizes: input.sizes,
    colors: input.colors,
    images,
    available: input.available ?? true,
    featured: input.featured ?? false,
    sku: input.sku,
    stock: input.stock,
    displayOrder: input.displayOrder,
    createdAt: input.createdAt,
    updatedAt: updated,
  };
}
