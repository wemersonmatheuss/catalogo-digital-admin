import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { BannerPlacement } from '../../core/models/catalog.models';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { NoticeService } from '../../core/services/notice.service';

@Component({
  selector: 'app-banner-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './banner-form.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerFormPage {
  private readonly catalog = inject(AdminCatalogService);
  private readonly notice = inject(NoticeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly editingId = this.route.snapshot.paramMap.get('id');
  readonly missing = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] }),
    subtitle: new FormControl('', { nonNullable: true }),
    imageUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    link: new FormControl('/produtos', { nonNullable: true }),
    placement: new FormControl<BannerPlacement>('hero', { nonNullable: true, validators: [Validators.required] }),
    displayOrder: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    active: new FormControl(true, { nonNullable: true }),
  });

  constructor() {
    if (!this.editingId) {
      return;
    }
    const banner = this.catalog.bannerById(this.editingId);
    if (!banner) {
      this.missing.set(true);
      return;
    }
    this.form.patchValue(banner);
  }

  usePlaceholder(): void {
    this.form.controls.imageUrl.setValue('assets/mock/photos/banner-loja.jpg');
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.formError.set(null);
    if (this.form.invalid) {
      this.formError.set('Informe o título e a imagem do banner.');
      return;
    }
    const result = this.catalog.saveBanner(this.form.getRawValue(), this.editingId ?? undefined);
    if (!result.ok) {
      this.formError.set(result.message);
      return;
    }
    this.notice.show(result.message);
    void this.router.navigateByUrl('/banners');
  }
}
