import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { NoticeService } from '../../core/services/notice.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-banner-list-page',
  imports: [RouterLink, ConfirmDialogComponent],
  template: `
    <header class="page-head">
      <div>
        <h1>Banners</h1>
        <p class="lead">As imagens da vitrine aparecem na página inicial do catálogo.</p>
      </div>
      <a class="primary" routerLink="/banners/novo">Novo banner</a>
    </header>

    @if (banners().length === 0) {
      <p class="muted" role="status">Nenhum banner cadastrado.</p>
    } @else {
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Posição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (banner of banners(); track banner.id) {
              <tr>
                <td>
                  <strong>{{ banner.title }}</strong>
                  <div class="muted">{{ banner.subtitle }}</div>
                </td>
                <td>{{ banner.placement === 'hero' ? 'Principal' : 'Faixa' }}</td>
                <td>{{ banner.active ? 'Ativo' : 'Oculto' }}</td>
                <td>
                  <div class="actions">
                    <a class="quiet" [routerLink]="['/banners', banner.id, 'editar']">Editar</a>
                    <button type="button" class="danger" (click)="askDelete(banner.id, confirm)">Excluir</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <app-confirm-dialog #confirm (confirmed)="confirmDelete()">
      O banner deixa de aparecer na vitrine do cliente.
    </app-confirm-dialog>
  `,
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
