import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { TranslationService } from '../../services/translation.service';
import { ProjectCard } from '../project-card/project-card';

@Component({
  selector: 'app-project-carousel',
  standalone: true,
  imports: [ProjectCard],
  templateUrl: './project-carousel.html',
  styleUrl: './project-carousel.css',
})
export class ProjectCarousel {
  protected readonly projectsService = inject(ProjectsService);
  protected readonly i18n = inject(TranslationService);

  readonly projects = this.projectsService.projects;
  readonly currentIndex = signal<number>(0);

  readonly total = computed(() => this.projects().length);
  readonly currentProject = computed(() => this.projects()[this.currentIndex()] ?? null);
  readonly prevProject = computed(() => {
    const idx = this.currentIndex();
    return idx > 0 ? this.projects()[idx - 1] : null;
  });
  readonly nextProject = computed(() => {
    const idx = this.currentIndex();
    return idx < this.total() - 1 ? this.projects()[idx + 1] : null;
  });

  readonly hasPrev = computed(() => this.currentIndex() > 0);
  readonly hasNext = computed(() => this.currentIndex() < this.total() - 1);

  private touchStartX = 0;

  goToPrev(): void {
    if (this.hasPrev()) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  goToNext(): void {
    if (this.hasNext()) {
      this.currentIndex.update((i) => i + 1);
    }
  }

  goToIndex(index: number): void {
    if (index >= 0 && index < this.total()) {
      this.currentIndex.set(index);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardNav(event: KeyboardEvent): void {
    // Evita interceptar teclas se o foco estiver dentro de um campo de formulário
    const targetTag = (event.target as HTMLElement)?.tagName?.toLowerCase();
    if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
      return;
    }

    if (event.key === 'ArrowLeft') {
      this.goToPrev();
    } else if (event.key === 'ArrowRight') {
      this.goToNext();
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.touchStartX = event.touches[0].clientX;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length > 0) {
      const touchEndX = event.changedTouches[0].clientX;
      const deltaX = touchEndX - this.touchStartX;
      const swipeThreshold = 45;

      if (deltaX > swipeThreshold) {
        this.goToPrev();
      } else if (deltaX < -swipeThreshold) {
        this.goToNext();
      }
    }
  }
}
