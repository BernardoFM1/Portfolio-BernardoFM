import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';
import { ThemeService } from '../../services/theme.service';
import { TranslationService } from '../../services/translation.service';

describe('ThemeToggle', () => {
  let fixture: ComponentFixture<ThemeToggle>;
  let component: ThemeToggle;
  let themeService: ThemeService;
  let i18n: TranslationService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    i18n = TestBed.inject(TranslationService);
    i18n.setLang('pt');
    themeService.setTheme('dark');
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct aria-label in dark mode and toggle on click', () => {
    const btn = fixture.nativeElement.querySelector('.theme-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toBe('Mudar para modo claro');

    btn.click();
    fixture.detectChanges();

    expect(themeService.currentTheme()).toBe('light');
    expect(btn.getAttribute('aria-label')).toBe('Mudar para modo escuro');
  });

  it('should update aria-label when language changes', () => {
    i18n.setLang('en');
    themeService.setTheme('dark');
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.theme-btn') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');

    btn.click();
    fixture.detectChanges();

    expect(btn.getAttribute('aria-label')).toBe('Switch to dark mode');
  });
});

