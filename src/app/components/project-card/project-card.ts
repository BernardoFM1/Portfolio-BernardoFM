import { Component, inject, input, output } from '@angular/core';
import { ProjectItem } from '../../models/project.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  protected readonly i18n = inject(TranslationService);

  readonly project = input.required<ProjectItem>();
  readonly variant = input<'featured' | 'neighbor'>('featured');
  readonly position = input<'prev' | 'active' | 'next'>('active');

  readonly selectCard = output<void>();

  onNeighborClick(): void {
    if (this.variant() === 'neighbor') {
      this.selectCard.emit();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.variant() === 'neighbor' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.selectCard.emit();
    }
  }
}
