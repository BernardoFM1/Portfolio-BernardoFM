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

  /**
   * URL da foto do perfil (opcional).
   * Pode ser um arquivo local (ex: 'profile.jpg') ou a URL do avatar do GitHub (ex: 'https://github.com/<usuario>.png').
   * Se não for fornecida, exibe o placeholder reservado com borda pontilhada conforme o wireframe.
   */
  readonly avatarUrl = input<string | null>(null);

  /**
   * Link para o perfil do GitHub.
   */
  readonly githubUrl = input<string>('https://github.com');

  /**
   * Link ou âncora para contato.
   */
  readonly contactUrl = input<string>('#contato');
}
