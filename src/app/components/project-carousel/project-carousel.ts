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
    const tot = this.total();
    if (tot <= 1) return null;
    const prevIdx = (this.currentIndex() - 1 + tot) % tot;
    return this.projects()[prevIdx];
  });
  readonly nextProject = computed(() => {
    const tot = this.total();
    if (tot <= 1) return null;
    const nextIdx = (this.currentIndex() + 1) % tot;
    return this.projects()[nextIdx];
  });

  readonly hasPrev = computed(() => this.total() > 1);
  readonly hasNext = computed(() => this.total() > 1);

  readonly animationDirection = signal<'next' | 'prev' | null>(null);

  private touchStartX = 0;

  goToPrev(): void {
    const tot = this.total();
    if (tot > 1) {
      this.animationDirection.set('prev');
      this.currentIndex.update((i) => (i - 1 + tot) % tot);
    }
  }

  goToNext(): void {
    const tot = this.total();
    if (tot > 1) {
      this.animationDirection.set('next');
      this.currentIndex.update((i) => (i + 1) % tot);
    }
  }

  goToIndex(index: number): void {
    if (index >= 0 && index < this.total() && index !== this.currentIndex()) {
      this.animationDirection.set(index > this.currentIndex() ? 'next' : 'prev');
      this.currentIndex.set(index);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardNav(event: KeyboardEvent): void {
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
