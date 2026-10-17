import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { startWith } from 'rxjs';

import { Gender } from '../../core/models/catalog.models';
import { GENDER_LABEL } from '../../core/models/catalog.labels';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { NoticeService } from '../../core/services/notice.service';

@Component({
  selector: 'app-product-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormPage {
  private readonly catalog = inject(AdminCatalogService);
  private readonly notice = inject(NoticeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly labels = GENDER_LABEL;
  readonly formError = signal<string | null>(null);
  readonly editingId = this.route.snapshot.paramMap.get('id');
  readonly missing = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0.01)] }),
    gender: new FormControl<Gender>('female', { nonNullable: true, validators: [Validators.required] }),
    categoryId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    sizes: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    colors: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    images: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    available: new FormControl(true, { nonNullable: true }),
    featured: new FormControl(false, { nonNullable: true }),
  });

  readonly gender = toSignal(this.form.controls.gender.valueChanges.pipe(startWith(this.form.controls.gender.value)), {
    initialValue: this.form.controls.gender.value,
  });

  readonly categories = computed(() => this.catalog.categoriesFor(this.gender()));

  constructor() {
    if (!this.editingId) {
      return;
    }
    const product = this.catalog.productById(this.editingId);
    if (!product) {
      this.missing.set(true);
      return;
    }
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      gender: product.gender,
      categoryId: product.categoryId,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      images: product.images.map((image) => image.url).join('\n'),
      available: product.available,
      featured: product.featured,
    });
  }

  usePlaceholder(): void {
    this.form.controls.images.setValue('assets/mock/peca.svg');
    this.form.controls.images.markAsDirty();
  }

  onGenderChange(): void {
    const allowed = this.catalog.categoriesFor(this.form.controls.gender.value).map((category) => category.id);
    if (!allowed.includes(this.form.controls.categoryId.value)) {
      this.form.controls.categoryId.setValue('');
    }
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.formError.set(null);
    if (this.form.invalid || this.form.controls.price.value == null) {
      this.formError.set('Revise os campos obrigatórios.');
      return;
    }
    const raw = this.form.getRawValue();
    const result = this.catalog.saveProduct(
      {
        name: raw.name,
        description: raw.description,
        price: raw.price ?? 0,
        gender: raw.gender,
        categoryId: raw.categoryId,
        sizes: splitList(raw.sizes),
        colors: splitList(raw.colors),
        imageUrls: splitLines(raw.images),
        available: raw.available,
        featured: raw.featured,
      },
      this.editingId ?? undefined,
    );
    if (!result.ok) {
      this.formError.set(result.message);
      return;
    }
    this.notice.show(result.message);
    void this.router.navigateByUrl('/produtos');
  }
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}
