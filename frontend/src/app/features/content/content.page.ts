import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { Banner } from '../../core/models/catalog.models';
import { HomeBlock, SiteContent } from '../../core/models/site-content';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { IconComponent } from '../../shared/icon.component';

interface Part {
  id: string;
  title: string;
  detail: string;
  group: string;
  movable: boolean;
  visible: boolean;
  order: number | null;
}

@Component({
  selector: 'app-content-page',
  imports: [RouterLink, IconComponent],
  templateUrl: './content.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPage {
  private readonly catalog = inject(AdminCatalogService);
  private readonly route = inject(ActivatedRoute);

  readonly draft = signal<SiteContent>(structuredClone(this.catalog.content()));
  readonly saved = signal(false);
  readonly section = toSignal(this.route.paramMap.pipe(map((params) => params.get('section'))), {
    initialValue: this.route.snapshot.paramMap.get('section'),
  });

  readonly heroBanners = computed(() => this.byPlace('hero'));
  readonly stripBanners = computed(() => this.byPlace('middle'));
  readonly block = computed(() => this.draft().blocks.find((item) => item.id === this.section()) ?? null);
  readonly blockIndex = computed(() => this.draft().blocks.findIndex((item) => item.id === this.section()));

  readonly parts = computed<Part[]>(() => {
    const home = this.draft().blocks.map((block, index) => ({
      id: block.id,
      title: this.blockName(block),
      detail: this.blockDetail(block),
      group: 'Página inicial',
      movable: true,
      visible: block.visible,
      order: index + 1,
    }));
    return [
      {
        id: 'cabecalho',
        title: 'Cabeçalho',
        detail: this.draft().brand,
        group: 'Loja',
        movable: false,
        visible: true,
        order: null,
      },
      ...home,
      {
        id: 'rodape',
        title: 'Rodapé',
        detail: this.draft().footer.city,
        group: 'Fechamento',
        movable: false,
        visible: true,
        order: null,
      },
      {
        id: 'carrinho',
        title: 'Carrinho',
        detail: this.draft().bag.title,
        group: 'Fechamento',
        movable: false,
        visible: true,
        order: null,
      },
    ];
  });

  readonly known = computed(() => this.parts().some((part) => part.id === this.section()));
  readonly title = computed(() => {
    const section = this.section();
    if (section === 'cabecalho') {
      return 'Cabeçalho';
    }
    if (section === 'rodape') {
      return 'Rodapé';
    }
    if (section === 'carrinho') {
      return 'Carrinho';
    }
    const block = this.block();
    return block ? this.blockName(block) : 'Conteúdo';
  });

  blockName(block: HomeBlock): string {
    if (block.type === 'hero') {
      return 'Destaque';
    }
    if (block.type === 'strips') {
      return 'Faixas';
    }
    if (block.type === 'products') {
      return block.source === 'recent' ? 'Novidades' : 'Destaques';
    }
    return block.gender === 'female' ? 'Categorias femininas' : 'Categorias masculinas';
  }

  valueOf(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  setBrand(value: string): void {
    this.patch({ brand: value });
  }

  setSeo(field: 'seoTitle' | 'seoDescription', value: string): void {
    this.patch({ [field]: value });
  }

  setNavLabel(index: number, label: string): void {
    const nav = this.draft().nav.map((item, itemIndex) => (itemIndex === index ? { ...item, label } : item));
    this.patch({ nav });
  }

  moveNav(index: number, direction: -1 | 1): void {
    const nav = moveItem(this.draft().nav, index, direction);
    if (nav) {
      this.patch({ nav });
    }
  }

  moveBlock(id: string, direction: -1 | 1): void {
    const index = this.draft().blocks.findIndex((block) => block.id === id);
    const blocks = moveItem(this.draft().blocks, index, direction);
    if (blocks) {
      this.patch({ blocks });
    }
  }

  toggleBlock(index: number, visible: boolean): void {
    const blocks = this.draft().blocks.map((block, blockIndex) =>
      blockIndex === index ? { ...block, visible } : block,
    );
    this.patch({ blocks });
  }

  setBlockText(index: number, field: 'eyebrow' | 'title' | 'linkLabel' | 'cta', value: string): void {
    const blocks = this.draft().blocks.map((block, blockIndex) => {
      if (blockIndex !== index) {
        return block;
      }
      if (field === 'cta' && block.type === 'hero') {
        return { ...block, cta: value };
      }
      if (field !== 'cta' && (block.type === 'products' || block.type === 'categories')) {
        return { ...block, [field]: value };
      }
      return block;
    });
    this.patch({ blocks });
  }

  setFooter(field: keyof SiteContent['footer'], value: string): void {
    this.patch({ footer: { ...this.draft().footer, [field]: value } });
  }

  setBag(field: keyof SiteContent['bag'], value: string): void {
    this.patch({ bag: { ...this.draft().bag, [field]: value } });
  }

  moveBanner(id: string, direction: -1 | 1): void {
    this.catalog.moveBanner(id, direction);
    this.saved.set(true);
  }

  setBannerText(banner: Banner, field: 'title' | 'subtitle', value: string): void {
    this.catalog.patchBannerText(
      banner.id,
      field === 'title' ? value : banner.title,
      field === 'subtitle' ? value : banner.subtitle,
    );
    this.saved.set(true);
  }

  private blockDetail(block: HomeBlock): string {
    if (block.type === 'hero') {
      return block.cta;
    }
    if (block.type === 'strips') {
      return 'Banners entre as seções';
    }
    return block.title;
  }

  private byPlace(placement: Banner['placement']): Banner[] {
    return this.catalog
      .banners()
      .filter((banner) => banner.placement === placement)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  private patch(partial: Partial<SiteContent>): void {
    const next = { ...this.draft(), ...partial };
    this.draft.set(next);
    this.catalog.saveContent(next);
    this.saved.set(true);
  }
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] | null {
  const target = index + direction;
  if (index < 0 || target < 0 || target >= items.length) {
    return null;
  }
  const next = items.slice();
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}
