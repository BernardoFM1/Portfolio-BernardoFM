import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCarousel } from './project-carousel';
import { ProjectsService } from '../../services/projects.service';
import { TranslationService } from '../../services/translation.service';

describe('ProjectCarousel', () => {
  let fixture: ComponentFixture<ProjectCarousel>;
  let component: ProjectCarousel;
  let i18n: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCarousel],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCarousel);
    component = fixture.componentInstance;
    i18n = TestBed.inject(TranslationService);
    i18n.setLang('pt');
    fixture.detectChanges();
  });

  it('should create the carousel', () => {
    expect(component).toBeTruthy();
  });

  it('should start at index 0 with cyclic neighbors enabled', () => {
    expect(component.currentIndex()).toBe(0);
    expect(component.hasPrev()).toBe(true);
    expect(component.hasNext()).toBe(true);
    expect(component.prevProject()).toBeTruthy();
    expect(component.nextProject()).toBeTruthy();

    const prevBtn = fixture.nativeElement.querySelector(
      '.carousel-nav-btn[aria-label="Projeto anterior"]',
    );
    expect(prevBtn.disabled).toBe(false);
  });

  it('should navigate to next project and wrap around cyclically', () => {
    const nextBtn = fixture.nativeElement.querySelector(
      '.carousel-nav-btn[aria-label="Próximo projeto"]',
    );
    const total = component.total();

    nextBtn.click();
    fixture.detectChanges();
    expect(component.currentIndex()).toBe(1);

    for (let i = 1; i < total; i++) {
      nextBtn.click();
    }
    fixture.detectChanges();
    expect(component.currentIndex()).toBe(0);
  });

  it('should loop backward to the last project when clicking previous at index 0', () => {
    const prevBtn = fixture.nativeElement.querySelector(
      '.carousel-nav-btn[aria-label="Projeto anterior"]',
    );
    prevBtn.click();
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(component.total() - 1);
  });

  it('should navigate using keyboard arrow keys with wrap around', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(component.currentIndex()).toBe(component.total() - 1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(component.currentIndex()).toBe(0);
  });

  it('should navigate when clicking a dot indicator', () => {
    const dots = fixture.nativeElement.querySelectorAll('.dot');
    if (dots.length > 1) {
      dots[1].click();
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(1);
    }
  });

  it('should set animationDirection and apply slide classes when navigating', () => {
    expect(component.animationDirection()).toBeNull();

    component.goToNext();
    fixture.detectChanges();
    expect(component.animationDirection()).toBe('next');
    const activeWrapperNext = fixture.nativeElement.querySelector('.slot-active .card-wrapper');
    expect(activeWrapperNext?.classList.contains('slide-next')).toBe(true);

    component.goToPrev();
    fixture.detectChanges();
    expect(component.animationDirection()).toBe('prev');
    const activeWrapperPrev = fixture.nativeElement.querySelector('.slot-active .card-wrapper');
    expect(activeWrapperPrev?.classList.contains('slide-prev')).toBe(true);
  });
});
