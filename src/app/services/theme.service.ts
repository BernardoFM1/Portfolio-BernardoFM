import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly storageKey = 'portfolio_theme';

  readonly currentTheme = signal<Theme>('dark');

  constructor() {
    this.initTheme();
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    this.persistTheme(theme);
  }

  private initTheme(): void {
    const stored = this.getStoredTheme();
    if (stored) {
      this.currentTheme.set(stored);
      this.applyTheme(stored);
      return;
    }

    const systemTheme = this.getSystemPreference();
    this.currentTheme.set(systemTheme);
    this.applyTheme(systemTheme);
  }

  private getSystemPreference(): Theme {
    try {
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
    } catch {
      // Fallback
    }
    return 'dark';
  }

  private applyTheme(theme: Theme): void {
    if (this.document && this.document.documentElement) {
      this.document.documentElement.setAttribute('data-theme', theme);
      this.document.documentElement.style.colorScheme = theme;
    }
  }

  private getStoredTheme(): Theme | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(this.storageKey);
        if (val === 'light' || val === 'dark') {
          return val;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return null;
  }

  private persistTheme(theme: Theme): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.storageKey, theme);
      }
    } catch {
      // Ignore storage errors
    }
  }
}

