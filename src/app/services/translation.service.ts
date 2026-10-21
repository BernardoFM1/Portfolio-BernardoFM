import { Injectable, computed, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import ptTranslations from '../i18n/pt.json';
import enTranslations from '../i18n/en.json';

export type Language = 'pt' | 'en';
export type TranslationSchema = typeof ptTranslations;

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly document = inject(DOCUMENT);

  private readonly translations: Record<Language, TranslationSchema> = {
    pt: ptTranslations,
    en: enTranslations,
  };

  readonly currentLang = signal<Language>('pt');

  readonly t = computed(() => this.translations[this.currentLang()]);

  constructor() {
    this.applyDocumentLang('pt');
  }

  setLang(lang: Language): void {
    if (this.currentLang() === lang) {
      return;
    }
    this.currentLang.set(lang);
    this.applyDocumentLang(lang);
  }

  private applyDocumentLang(lang: Language): void {
    if (this.document && this.document.documentElement) {
      this.document.documentElement.lang = lang;
    }
  }
}
