import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GENDER_LABEL } from '../../core/models/catalog.labels';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { NoticeService } from '../../core/services/notice.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-category-list-page',
  imports: [RouterLink, ConfirmDialogComponent, IconComponent],
  templateUrl: './category-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListPage {
  private readonly catalog = inject(AdminCatalogService);
  private readonly notice = inject(NoticeService);
  readonly labels = GENDER_LABEL;
  readonly categories = computed(() =>
    [...this.catalog.categories()].sort(
      (a, b) => (a.displayOrder ?? 1_000_000) - (b.displayOrder ?? 1_000_000) || a.name.localeCompare(b.name, 'pt-BR'),
    ),
  );
  readonly pendingDelete = signal<string | null>(null);
  readonly blockMessage = signal<string | null>(null);

  count(id: string): number {
    return this.catalog.productCount(id);
  }

  toggle(id: string, active: boolean): void {
    const result = this.catalog.setCategoryStatus(id, active ? 'active' : 'inactive');
    this.notice.show(result.message);
  }

  move(id: string, direction: -1 | 1): void {
    const result = this.catalog.moveCategory(id, direction);
    if (result.ok) {
      this.notice.show(result.message);
    }
  }

  askDelete(id: string, dialog: ConfirmDialogComponent): void {
    this.blockMessage.set(null);
    if (this.catalog.productCount(id) > 0) {
      this.blockMessage.set(
        'Esta categoria tem peças vinculadas. Mova ou exclua essas peças antes de excluir a categoria.',
      );
      return;
    }
    this.pendingDelete.set(id);
    dialog.open();
  }

  confirmDelete(): void {
    const id = this.pendingDelete();
    if (!id) {
      return;
    }
    const result = this.catalog.deleteCategory(id);
    this.notice.show(result.ok ? result.message : result.message);
    if (!result.ok) {
      this.blockMessage.set(result.message);
    }
    this.pendingDelete.set(null);
  }
}
