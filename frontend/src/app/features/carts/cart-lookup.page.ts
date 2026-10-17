import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { CartApiService, SavedCart } from '../../core/api/cart-api.service';
import { BrlPipe } from '../../shared/brl.pipe';

@Component({
  selector: 'app-cart-lookup-page',
  imports: [FormsModule, BrlPipe],
  templateUrl: './cart-lookup.page.html',
  styleUrl: './cart-lookup.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartLookupPage {
  private readonly carts = inject(CartApiService);

  code = '';
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly cart = signal<SavedCart | null>(null);

  async search(): Promise<void> {
    const code = this.code.trim().toUpperCase();
    if (!code || this.loading()) {
      return;
    }
    this.code = code;
    this.loading.set(true);
    this.error.set(null);
    this.cart.set(null);
    try {
      const cart = await firstValueFrom(this.carts.findByCode(code));
      this.cart.set(cart);
    } catch {
      this.error.set('Nenhum carrinho com esse código. Confira o ID da mensagem e se a API está no ar.');
    } finally {
      this.loading.set(false);
    }
  }

  when(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }
}
