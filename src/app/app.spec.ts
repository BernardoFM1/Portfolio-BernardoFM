import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TranslationService } from './services/translation.service';

describe('App', () => {
  let i18n: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    i18n = TestBed.inject(TranslationService);
    i18n.setLang('pt');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header with brand placeholder', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-text')?.textContent?.trim()).toBe('[seunome]');
  });

  it('should render profile hero component', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-profile-hero')).toBeTruthy();
  });

  it('should react to language changes in the main sections', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.section-title')?.textContent?.trim()).toBe('PROJETOS');

    i18n.setLang('en');
    fixture.detectChanges();

    expect(compiled.querySelector('.section-title')?.textContent?.trim()).toBe('PROJECTS');
  });
});
