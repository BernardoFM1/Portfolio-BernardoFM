import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly storageKey = 'portfolio_theme';
  readonly contrastStorageKey = 'portfolio_high_contrast';

  readonly currentTheme = signal<Theme>('dark');
  readonly highContrast = signal<boolean>(false);

  constructor() {
    this.initTheme();
    this.initContrast();
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

  toggleHighContrast(): void {
    this.setHighContrast(!this.highContrast());
  }

  setHighContrast(enabled: boolean): void {
    this.highContrast.set(enabled);
    this.applyContrast(enabled);
    this.persistContrast(enabled);
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

  private initContrast(): void {
    const stored = this.getStoredContrast();
    if (stored !== null) {
      this.highContrast.set(stored);
      this.applyContrast(stored);
      return;
    }

    const systemHighContrast = this.getSystemContrastPreference();
    this.highContrast.set(systemHighContrast);
    this.applyContrast(systemHighContrast);
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

  private getSystemContrastPreference(): boolean {
    try {
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-contrast: more)').matches;
      }
    } catch {
      // Fallback
    }
    return false;
  }

  private applyTheme(theme: Theme): void {
    if (this.document && this.document.documentElement) {
      this.document.documentElement.setAttribute('data-theme', theme);
      this.document.documentElement.style.colorScheme = theme;
    }
  }

  private applyContrast(enabled: boolean): void {
    if (this.document && this.document.documentElement) {
      if (enabled) {
        this.document.documentElement.setAttribute('data-contrast', 'high');
      } else {
        this.document.documentElement.removeAttribute('data-contrast');
      }
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

  private getStoredContrast(): boolean | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(this.contrastStorageKey);
        if (val === 'true') {
          return true;
        }
        if (val === 'false') {
          return false;
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

  private persistContrast(enabled: boolean): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.contrastStorageKey, String(enabled));
      }
    } catch {
      // Ignore storage errors
    }
  }
}

