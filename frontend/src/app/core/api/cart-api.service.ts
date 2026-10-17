import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface SavedCartItem {
  productId: string;
  name: string;
  price: number;
  size: string | null;
  color: string | null;
  imageUrl: string;
}

export interface SavedCart {
  id: string;
  createdAt: string;
  items: SavedCartItem[];
}

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly http = inject(HttpClient);

  findByCode(code: string): Observable<SavedCart> {
    return this.http.get<SavedCart>(`${environment.apiUrl}/carts/${encodeURIComponent(code)}`);
  }
}
