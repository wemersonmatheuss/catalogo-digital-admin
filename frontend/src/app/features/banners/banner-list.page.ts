import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { NoticeService } from '../../core/services/notice.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-banner-list-page',
  imports: [RouterLink, ConfirmDialogComponent, IconComponent],
  templateUrl: './banner-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerListPage {
  private readonly catalog = inject(AdminCatalogService);
  private readonly notice = inject(NoticeService);
  readonly banners = this.catalog.banners;
  readonly pendingDelete = signal<string | null>(null);

  askDelete(id: string, dialog: ConfirmDialogComponent): void {
    this.pendingDelete.set(id);
    dialog.open();
  }

  confirmDelete(): void {
    const id = this.pendingDelete();
    if (!id) {
      return;
    }
    this.notice.show(this.catalog.deleteBanner(id).message);
    this.pendingDelete.set(null);
  }
}
