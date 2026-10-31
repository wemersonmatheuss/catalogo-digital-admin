export interface NavItem {
  id: string;
  label: string;
  href: string;
  exact: boolean;
}

export interface HeroBlock {
  id: string;
  type: 'hero';
  visible: boolean;
  cta: string;
}

export interface StripsBlock {
  id: string;
  type: 'strips';
  visible: boolean;
}

export interface ProductsBlock {
  id: string;
  type: 'products';
  source: 'recent' | 'featured';
  visible: boolean;
  eyebrow: string;
  title: string;
  linkLabel: string;
  link: string;
}

export interface CategoriesBlock {
  id: string;
  type: 'categories';
  gender: 'female' | 'male';
  visible: boolean;
  eyebrow: string;
  title: string;
  linkLabel: string;
  link: string;
}

export type HomeBlock = HeroBlock | StripsBlock | ProductsBlock | CategoriesBlock;

export interface BagCopy {
  eyebrow: string;
  title: string;
  continueLabel: string;
  emptyTitle: string;
  emptyMessage: string;
  browseLabel: string;
  dataTitle: string;
  dataHint: string;
  sendLabel: string;
}

export interface SiteContent {
  brand: string;
  seoTitle: string;
  seoDescription: string;
  nav: NavItem[];
  blocks: HomeBlock[];
  footer: {
    aboutTitle: string;
    aboutText: string;
    catalogTitle: string;
    contactTitle: string;
    city: string;
    whatsappLabel: string;
    floatLabel: string;
    mark: string;
  };
  bag: BagCopy;
}

const DEFAULT_SITE: SiteContent = {
  brand: 'Sempre-Viva',
  seoTitle: 'Sempre-Viva',
  seoDescription: 'Catálogo digital da Sempre-Viva, loja de roupas em Gravatá, Pernambuco.',
  nav: [
    { id: 'home', label: 'Início', href: '/', exact: true },
    { id: 'female', label: 'Feminino', href: '/produtos/feminino', exact: false },
    { id: 'male', label: 'Masculino', href: '/produtos/masculino', exact: false },
    { id: 'pieces', label: 'Peças', href: '/produtos', exact: true },
  ],
  blocks: [
    { id: 'hero', type: 'hero', visible: true, cta: 'Explorar a coleção' },
    {
      id: 'recent',
      type: 'products',
      source: 'recent',
      visible: true,
      eyebrow: 'Últimas chegadas',
      title: 'Novidades',
      linkLabel: 'Ver todos',
      link: '/produtos',
    },
    { id: 'strips', type: 'strips', visible: true },
    {
      id: 'featured',
      type: 'products',
      source: 'featured',
      visible: true,
      eyebrow: 'Mais vendidos',
      title: 'Em destaque',
      linkLabel: 'Ver todos',
      link: '/produtos',
    },
    {
      id: 'female-categories',
      type: 'categories',
      gender: 'female',
      visible: true,
      eyebrow: 'Roupas e acessórios',
      title: 'Feminino',
      linkLabel: 'Ver todos',
      link: '/produtos/feminino',
    },
    {
      id: 'male-categories',
      type: 'categories',
      gender: 'male',
      visible: true,
      eyebrow: 'Roupas e acessórios',
      title: 'Masculino',
      linkLabel: 'Ver todos',
      link: '/produtos/masculino',
    },
  ],
  footer: {
    aboutTitle: 'A loja',
    aboutText:
      'Catálogo de roupas da Sempre-Viva, em Gravatá, Pernambuco. Peças para o dia a dia, com atendimento pelo WhatsApp.',
    catalogTitle: 'Catálogo',
    contactTitle: 'Contato',
    city: 'Gravatá, Pernambuco',
    whatsappLabel: 'Falar com a loja',
    floatLabel: 'WhatsApp',
    mark: 'Sempre-Viva',
  },
  bag: {
    eyebrow: 'Sua seleção',
    title: 'Carrinho',
    continueLabel: 'Continuar vendo',
    emptyTitle: 'Nenhuma peça no carrinho',
    emptyMessage: 'Navegue pelo catálogo e adicione o que gostar.',
    browseLabel: 'Ver coleção',
    dataTitle: 'Seus dados',
    dataHint: 'Preencha para facilitar o atendimento no WhatsApp.',
    sendLabel: 'Falar no WhatsApp',
  },
};

export function defaultSiteContent(): SiteContent {
  return structuredClone(DEFAULT_SITE);
}

export function normalizeSiteContent(value: unknown): SiteContent {
  const defaults = defaultSiteContent();
  if (!value || typeof value !== 'object') {
    return defaults;
  }
  const raw = value as Partial<SiteContent>;
  return {
    brand: text(raw.brand, defaults.brand),
    seoTitle: text(raw.seoTitle, defaults.seoTitle),
    seoDescription: text(raw.seoDescription, defaults.seoDescription),
    nav: normalizeNav(raw.nav, defaults.nav),
    blocks: normalizeBlocks(raw.blocks, defaults.blocks),
    footer: {
      aboutTitle: text(raw.footer?.aboutTitle, defaults.footer.aboutTitle),
      aboutText: text(raw.footer?.aboutText, defaults.footer.aboutText),
      catalogTitle: text(raw.footer?.catalogTitle, defaults.footer.catalogTitle),
      contactTitle: text(raw.footer?.contactTitle, defaults.footer.contactTitle),
      city: text(raw.footer?.city, defaults.footer.city),
      whatsappLabel: text(raw.footer?.whatsappLabel, defaults.footer.whatsappLabel),
      floatLabel: text(raw.footer?.floatLabel, defaults.footer.floatLabel),
      mark: text(raw.footer?.mark, defaults.footer.mark),
    },
    bag: {
      eyebrow: text(raw.bag?.eyebrow, defaults.bag.eyebrow),
      title: text(raw.bag?.title, defaults.bag.title),
      continueLabel: text(raw.bag?.continueLabel, defaults.bag.continueLabel),
      emptyTitle: text(raw.bag?.emptyTitle, defaults.bag.emptyTitle),
      emptyMessage: text(raw.bag?.emptyMessage, defaults.bag.emptyMessage),
      browseLabel: text(raw.bag?.browseLabel, defaults.bag.browseLabel),
      dataTitle: text(raw.bag?.dataTitle, defaults.bag.dataTitle),
      dataHint: text(raw.bag?.dataHint, defaults.bag.dataHint),
      sendLabel: text(raw.bag?.sendLabel, defaults.bag.sendLabel),
    },
  };
}

function normalizeNav(value: unknown, defaults: NavItem[]): NavItem[] {
  const saved = Array.isArray(value) ? value : [];
  const byId = new Map(defaults.map((item) => [item.id, item]));
  const ordered: NavItem[] = [];
  for (const item of saved) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const id = String((item as NavItem).id);
    const base = byId.get(id);
    if (!base) {
      continue;
    }
    ordered.push({ ...base, label: text((item as NavItem).label, base.label) });
    byId.delete(id);
  }
  return [...ordered, ...byId.values()];
}

function normalizeBlocks(value: unknown, defaults: HomeBlock[]): HomeBlock[] {
  const saved = Array.isArray(value) ? value : [];
  const byId = new Map(defaults.map((block) => [block.id, block]));
  const ordered: HomeBlock[] = [];
  for (const item of saved) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const id = String((item as HomeBlock).id);
    const base = byId.get(id);
    if (!base || (item as HomeBlock).type !== base.type) {
      continue;
    }
    ordered.push(mergeBlock(base, item as HomeBlock));
    byId.delete(id);
  }
  return [...ordered, ...byId.values()];
}

function mergeBlock(base: HomeBlock, saved: HomeBlock): HomeBlock {
  const visible = typeof saved.visible === 'boolean' ? saved.visible : base.visible;
  if (base.type === 'hero' && saved.type === 'hero') {
    return { ...base, visible, cta: text(saved.cta, base.cta) };
  }
  if (base.type === 'strips' && saved.type === 'strips') {
    return { ...base, visible };
  }
  if (base.type === 'products' && saved.type === 'products') {
    return {
      ...base,
      visible,
      eyebrow: text(saved.eyebrow, base.eyebrow),
      title: text(saved.title, base.title),
      linkLabel: text(saved.linkLabel, base.linkLabel),
    };
  }
  if (base.type === 'categories' && saved.type === 'categories') {
    return {
      ...base,
      visible,
      eyebrow: text(saved.eyebrow, base.eyebrow),
      title: text(saved.title, base.title),
      linkLabel: text(saved.linkLabel, base.linkLabel),
    };
  }
  return base;
}

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}
