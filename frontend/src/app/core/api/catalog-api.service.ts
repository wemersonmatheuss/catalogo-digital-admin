import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CatalogSnapshot } from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly http = inject(HttpClient);

  getCatalog(): Observable<CatalogSnapshot> {
    return this.http.get<CatalogSnapshot>(`${environment.apiUrl}/catalog`);
  }

  replaceCatalog(snapshot: CatalogSnapshot): Observable<CatalogSnapshot> {
    return this.http.put<CatalogSnapshot>(`${environment.apiUrl}/catalog`, snapshot);
  }
}
