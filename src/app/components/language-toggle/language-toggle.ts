import { Component, inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [],
  templateUrl: './language-toggle.html',
  styleUrl: './language-toggle.css',
})
export class LanguageToggle {
  protected readonly i18n = inject(TranslationService);

  switchLang(lang: 'pt' | 'en'): void {
    this.i18n.setLang(lang);
  }
}
