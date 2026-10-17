import { Injectable, inject, signal } from '@angular/core';

import { CatalogApiService } from '../api/catalog-api.service';
import { CatalogSnapshot } from '../models/catalog.models';

const empty: CatalogSnapshot = { categories: [], products: [], banners: [] };

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
        });
        this.ready.set(true);
        this.error.set(null);
      },
      error: () => {
        this.error.set('Não foi possível carregar o catálogo. Confira se a API local está em http://localhost:3002.');
      },
    });
  }

  replace(next: CatalogSnapshot): void {
    if (!this.ready()) {
      return;
    }
    const copy = structuredClone(next);
    this.state.set(copy);
    this.api.replaceCatalog(copy).subscribe({
      error: () => {
        this.error.set('Não foi possível salvar. A API local não respondeu.');
      },
    });
  }
}
