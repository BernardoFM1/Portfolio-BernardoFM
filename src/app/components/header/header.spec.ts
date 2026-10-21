import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { TranslationService } from '../../services/translation.service';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let component: Header;
  let i18n: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    i18n = TestBed.inject(TranslationService);
    i18n.setLang('pt');
    fixture.detectChanges();
  });

  it('should create the header', () => {
    expect(component).toBeTruthy();
  });

  it('should render brand and navigation in Portuguese by default', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.brand-text')?.textContent?.trim()).toBe('[seunome]');

    const navLinks = el.querySelectorAll('.desktop-nav .nav-link');
    expect(navLinks[0]?.textContent?.trim()).toBe('Projetos');
    expect(navLinks[1]?.textContent?.trim()).toBe('GitHub');
    expect(navLinks[2]?.textContent?.trim()).toBe('Contato');
  });

  it('should update navigation when language changes to English', () => {
    i18n.setLang('en');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const navLinks = el.querySelectorAll('.desktop-nav .nav-link');
    expect(navLinks[0]?.textContent?.trim()).toBe('Projects');
    expect(navLinks[1]?.textContent?.trim()).toBe('GitHub');
    expect(navLinks[2]?.textContent?.trim()).toBe('Contact');
  });

  it('should include language toggle component', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-language-toggle')).toBeTruthy();
  });
});
