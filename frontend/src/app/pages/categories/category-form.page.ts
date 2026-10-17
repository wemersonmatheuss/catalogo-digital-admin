import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Gender } from '../../core/models/catalog.models';
import { GENDER_LABEL } from '../../core/models/catalog.labels';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { NoticeService } from '../../core/services/notice.service';

@Component({
  selector: 'app-category-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormPage {
  private readonly catalog = inject(AdminCatalogService);
  private readonly notice = inject(NoticeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly labels = GENDER_LABEL;
  readonly editingId = this.route.snapshot.paramMap.get('id');
  readonly missing = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] }),
    gender: new FormControl<Gender>('female', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<'active' | 'inactive'>('active', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    if (!this.editingId) {
      return;
    }
    const category = this.catalog.categoryById(this.editingId);
    if (!category) {
      this.missing.set(true);
      return;
    }
    this.form.patchValue({
      name: category.name,
      gender: category.gender,
      status: category.status,
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.formError.set(null);
    if (this.form.invalid) {
      this.formError.set('Informe o nome da categoria.');
      return;
    }
    const raw = this.form.getRawValue();
    const result = this.catalog.saveCategory(raw, this.editingId ?? undefined);
    if (!result.ok) {
      this.formError.set(result.message);
      return;
    }
    this.notice.show(result.message);
    void this.router.navigateByUrl('/categorias');
  }
}
