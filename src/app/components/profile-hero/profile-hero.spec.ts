import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ProfileHero } from './profile-hero';
import { TranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  imports: [ProfileHero],
  template: `<app-profile-hero [avatarUrl]="avatar()"></app-profile-hero>`,
})
class TestHostComponent {
  avatar = signal<string | null>('https://github.com/BernardoFM1.png');
}

describe('ProfileHero', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let i18n: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ProfileHero],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    i18n = TestBed.inject(TranslationService);
    i18n.setLang('pt');
    fixture.detectChanges();
  });

  it('should render the GitHub avatar image by default', () => {
    const el = fixture.nativeElement as HTMLElement;
    const img = el.querySelector<HTMLImageElement>('.avatar-img');
    expect(img).toBeTruthy();
    expect(img?.src).toContain('BernardoFM1.png');
    expect(el.querySelector('.avatar-placeholder')).toBeNull();
  });

  it('should render the dashed placeholder when avatarUrl is explicitly null', () => {
    host.avatar.set(null);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const placeholder = el.querySelector('.avatar-placeholder');
    expect(placeholder).toBeTruthy();
    expect(placeholder?.textContent?.trim()).toBe('[sua foto]');
    expect(el.querySelector('.avatar-img')).toBeNull();
  });

  it('should render name, stack, and bio translated', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.hero-name')?.textContent?.trim()).toBe('Bernardo Fernando');
    expect(el.querySelector('.hero-stack')?.textContent?.trim()).toBe(
      'Desenvolvedor Backend · C# · ASP.NET Core',
    );

    i18n.setLang('en');
    fixture.detectChanges();

    expect(el.querySelector('.hero-stack')?.textContent?.trim()).toBe(
      'Backend Developer · C# · ASP.NET Core',
    );
  });

  it('should render quick links pointing to GitHub and LinkedIn', () => {
    const el = fixture.nativeElement as HTMLElement;
    const links = el.querySelectorAll<HTMLAnchorElement>('.mobile-nav .quick-link');
    expect(links[0]?.href).toContain('BernardoFM1');
    expect(links[1]?.href).toContain('linkedin.com/in/bernardo-fernando1');
  });
});
