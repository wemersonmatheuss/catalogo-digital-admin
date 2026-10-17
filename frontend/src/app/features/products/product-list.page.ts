import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GENDER_LABEL } from '../../core/models/catalog.labels';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { NoticeService } from '../../core/services/notice.service';
import { BrlPipe } from '../../shared/brl.pipe';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list-page',
  imports: [RouterLink, BrlPipe, ConfirmDialogComponent],
  templateUrl: './product-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {
  private readonly catalog = inject(AdminCatalogService);
  private readonly notice = inject(NoticeService);
  readonly labels = GENDER_LABEL;
  readonly search = signal('');
  readonly pendingDelete = signal<string | null>(null);

  readonly rows = computed(() => {
    const term = this.search().trim().toLocaleLowerCase('pt-BR');
    return this.catalog
      .products()
      .filter((product) => !term || product.name.toLocaleLowerCase('pt-BR').includes(term))
      .map((product) => ({
        product,
        category: this.catalog.categoryById(product.categoryId)?.name ?? 'Sem categoria',
      }));
  });

  onSearch(value: string): void {
    this.search.set(value);
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
}
