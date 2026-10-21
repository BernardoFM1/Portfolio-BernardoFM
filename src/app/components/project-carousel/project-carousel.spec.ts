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

  it('should start at index 0 without left neighbor', () => {
    expect(component.currentIndex()).toBe(0);
    expect(component.hasPrev()).toBe(false);
    expect(component.hasNext()).toBe(true);

    const prevBtn = fixture.nativeElement.querySelector(
      '.carousel-nav-btn[aria-label="Projeto anterior"]',
    );
    expect(prevBtn.disabled).toBe(true);
  });

  it('should navigate to next project on next button click', () => {
    const nextBtn = fixture.nativeElement.querySelector(
      '.carousel-nav-btn[aria-label="Próximo projeto"]',
    );
    nextBtn.click();
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(1);
    expect(component.hasPrev()).toBe(true);
    expect(component.prevProject()).toBeTruthy();

    const counter = fixture.nativeElement.querySelector('.carousel-counter');
    expect(counter.textContent.trim()).toContain('2 /');
  });

  it('should navigate using keyboard arrow keys', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(component.currentIndex()).toBe(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(component.currentIndex()).toBe(0);
  });

  it('should navigate when clicking a dot indicator', () => {
    const dots = fixture.nativeElement.querySelectorAll('.dot');
    if (dots.length > 2) {
      dots[2].click();
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(2);
    }
  });
});
