import { Injectable, inject, signal } from '@angular/core';

import { CatalogApiService } from '../api/catalog-api.service';
import { CatalogSnapshot } from '../models/catalog.models';
import { defaultSiteContent } from '../models/site-content';

const empty: CatalogSnapshot = { categories: [], products: [], banners: [], content: defaultSiteContent() };

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly api = inject(CatalogApiService);
  private readonly state = signal<CatalogSnapshot>(empty);

  readonly snapshot = this.state.asReadonly();
  readonly ready = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.api.getCatalog().subscribe({
      next: (data) => {
        this.state.set({
          categories: data.categories ?? [],
          products: data.products ?? [],
          banners: data.banners ?? [],
          content: data.content ?? defaultSiteContent(),
        });
        this.ready.set(true);
        this.error.set(null);
      },
      error: () => {
        this.error.set('Não foi possível carregar o catálogo. Confira se a API local está em http://localhost:3002.');
      },
    });
  }

  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  replace(next: CatalogSnapshot): void {
    if (!this.ready()) {
      return;
    }
    this.state.set(structuredClone(next));
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
    this.saveTimer = setTimeout(() => {
      this.api.replaceCatalog(structuredClone(this.state())).subscribe({
        error: () => {
          this.error.set('Não foi possível salvar. A API local não respondeu.');
        },
      });
    }, 350);
  }
}
