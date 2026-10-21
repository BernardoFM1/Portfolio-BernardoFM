import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageToggle } from './language-toggle';
import { TranslationService } from '../../services/translation.service';

describe('LanguageToggle', () => {
  let fixture: ComponentFixture<LanguageToggle>;
  let component: LanguageToggle;
  let i18n: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageToggle);
    component = fixture.componentInstance;
    i18n = TestBed.inject(TranslationService);
    i18n.setLang('pt');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render PT button as pressed and active by default', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);

    const ptBtn = buttons[0];
    const enBtn = buttons[1];

    expect(ptBtn.getAttribute('aria-pressed')).toBe('true');
    expect(ptBtn.classList.contains('active')).toBe(true);

    expect(enBtn.getAttribute('aria-pressed')).toBe('false');
    expect(enBtn.classList.contains('active')).toBe(false);
  });

  it('should switch language to EN on click and update aria-pressed', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const enBtn = buttons[1];

    enBtn.click();
    fixture.detectChanges();

    expect(i18n.currentLang()).toBe('en');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
  });
});
