import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GENDER_LABEL } from '../../core/models/catalog.labels';
import { Product } from '../../core/models/catalog.models';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { BrlPipe } from '../../shared/brl.pipe';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, BrlPipe, IconComponent],
  templateUrl: './dashboard.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly catalog = inject(AdminCatalogService);
  readonly labels = GENDER_LABEL;
  readonly stats = this.catalog.stats;

  readonly structure = computed(() => {
    const categories = this.catalog.categories();
    const banners = this.catalog.banners();
    const products = this.catalog.products();
    return {
      inactiveCategories: categories.filter((category) => category.status !== 'active').length,
      featured: products.filter((product) => product.featured).length,
      activeBanners: banners.filter((banner) => banner.active).length,
      banners: banners.length,
    };
  });

  readonly recent = computed(() =>
    [...this.catalog.products()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5)
      .map((product) => ({
        product,
        category: this.catalog.categoryById(product.categoryId)?.name ?? 'Sem categoria',
      })),
  );

  readonly femaleShare = computed(() => {
    const total = this.stats().products;
    if (!total) {
      return 0;
    }
    return Math.round((this.stats().female / total) * 100);
  });

  cover(product: Product): string | null {
    return product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url ?? null;
  }
}
