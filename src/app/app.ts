import { Component, inject } from '@angular/core';
import { Header } from './components/header/header';
import { ProfileHero } from './components/profile-hero/profile-hero';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, ProfileHero],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly i18n = inject(TranslationService);
}
