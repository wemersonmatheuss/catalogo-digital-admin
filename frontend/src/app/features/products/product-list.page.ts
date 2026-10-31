import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GENDER_LABEL } from '../../core/models/catalog.labels';
import { Gender, Product } from '../../core/models/catalog.models';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { NoticeService } from '../../core/services/notice.service';
import { BrlPipe } from '../../shared/brl.pipe';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../../shared/icon.component';

type GenderFilter = 'all' | Gender;
type AvailabilityFilter = 'all' | 'available' | 'hidden';

@Component({
  selector: 'app-product-list-page',
  imports: [RouterLink, BrlPipe, ConfirmDialogComponent, IconComponent],
  templateUrl: './product-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {
  private readonly catalog = inject(AdminCatalogService);
  private readonly notice = inject(NoticeService);
  readonly labels = GENDER_LABEL;
  readonly search = signal('');
  readonly genderFilter = signal<GenderFilter>('all');
  readonly availabilityFilter = signal<AvailabilityFilter>('all');
  readonly pendingDelete = signal<string | null>(null);
  readonly total = computed(() => this.catalog.products().length);

  readonly rows = computed(() => {
    const term = this.search().trim().toLocaleLowerCase('pt-BR');
    const gender = this.genderFilter();
    const availability = this.availabilityFilter();
    return this.catalog
      .products()
      .filter((product) => {
        const category = this.catalog.categoryById(product.categoryId)?.name ?? '';
        const haystack = `${product.name} ${category}`.toLocaleLowerCase('pt-BR');
        const matchesTerm = !term || haystack.includes(term);
        const matchesGender = gender === 'all' || product.gender === gender;
        const matchesAvailability =
          availability === 'all' ||
          (availability === 'available' && product.available) ||
          (availability === 'hidden' && !product.available);
        return matchesTerm && matchesGender && matchesAvailability;
      })
      .map((product) => ({
        product,
        category: this.catalog.categoryById(product.categoryId)?.name ?? 'Sem categoria',
      }))
      .sort((a, b) => (a.product.displayOrder ?? 1_000_000) - (b.product.displayOrder ?? 1_000_000) || a.product.name.localeCompare(b.product.name, 'pt-BR'));
  });

  onSearch(value: string): void {
    this.search.set(value);
  }

  setGender(value: GenderFilter): void {
    this.genderFilter.set(value);
  }

  setAvailability(value: AvailabilityFilter): void {
    this.availabilityFilter.set(value);
  }

  cover(product: Product): string | null {
    return product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url ?? null;
  }

  askDelete(id: string, dialog: ConfirmDialogComponent): void {
    this.pendingDelete.set(id);
    dialog.open();
  }

  confirmDelete(): void {
    const id = this.pendingDelete();
    if (!id) {
      return;
    }
    const result = this.catalog.deleteProduct(id);
    this.notice.show(result.message);
    this.pendingDelete.set(null);
  }

  toggle(id: string, available: boolean): void {
    const result = this.catalog.setAvailability(id, available);
    this.notice.show(result.message);
  }

  move(id: string, direction: -1 | 1): void {
    const result = this.catalog.moveProduct(
      id,
      direction,
      this.rows().map((row) => row.product.id),
    );
    if (result.ok) {
      this.notice.show(result.message);
    }
  }
}
