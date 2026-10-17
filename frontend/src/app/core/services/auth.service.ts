import { Injectable, signal } from '@angular/core';

interface Session {
  token: string;
  email: string;
}

const SESSION_KEY = 'sempre-viva.admin.session';

/**
 * Sessão temporária do painel.
 * A senha não é armazenada. A verificação real fica no backend, com hash e token.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<Session | null>(this.read());

  readonly email = () => this.session()?.email ?? null;

  isAuthenticated(): boolean {
    return this.session() !== null;
  }

  login(email: string, password: string): { ok: true } | { ok: false; message: string } {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return { ok: false, message: 'Informe um e-mail válido.' };
    }
    if (password.trim().length < 8) {
      return { ok: false, message: 'A senha precisa ter pelo menos 8 caracteres.' };
    }

    const next: Session = { token: crypto.randomUUID(), email: normalized };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: next.token, email: next.email }));
    this.session.set(next);
    return { ok: true };
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.session.set(null);
  }

  private read(): Session | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as Session;
      if (!parsed.token || !parsed.email) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }
}
