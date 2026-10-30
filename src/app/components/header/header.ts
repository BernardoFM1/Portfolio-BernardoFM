import { Component, inject, input } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { LanguageToggle } from '../language-toggle/language-toggle';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LanguageToggle, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly i18n = inject(TranslationService);

  readonly githubUrl = input<string>('https://github.com/BernardoFM1');
  readonly contactUrl = input<string>('https://www.linkedin.com/in/bernardo-fernando1/');
}
