import { Component, inject, input } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-profile-hero',
  standalone: true,
  imports: [],
  templateUrl: './profile-hero.html',
  styleUrl: './profile-hero.css',
})
export class ProfileHero {
  protected readonly i18n = inject(TranslationService);

  readonly avatarUrl = input<string | null>('https://github.com/BernardoFM1.png');
  readonly githubUrl = input<string>('https://github.com/BernardoFM1');
  readonly contactUrl = input<string>('https://www.linkedin.com/in/bernardo-fernando1/');
}
