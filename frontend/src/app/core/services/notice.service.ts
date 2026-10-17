import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NoticeService {
  readonly text = signal<string | null>(null);

  show(message: string): void {
    this.text.set(message);
  }

  clear(): void {
    this.text.set(null);
  }
}
