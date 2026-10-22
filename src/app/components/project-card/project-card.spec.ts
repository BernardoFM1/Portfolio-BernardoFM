import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ProjectCard } from './project-card';
import { ProjectItem } from '../../models/project.model';
import { TranslationService } from '../../services/translation.service';

const mockProject: ProjectItem = {
  slug: 'test-project',
  title: '[Nome do projeto]',
  summary: '[Resumo do projeto de teste para validação de componentes]',
  url: 'https://github.com/BernardoFM1/test-project',
  languages: ['C#', 'ASP.NET Core'],
  topics: ['backend'],
  pushedAt: '2026-10-01T12:00:00Z',
};

@Component({
  standalone: true,
  imports: [ProjectCard],
  template: `
    <app-project-card
      [project]="project()"
      [variant]="variant()"
      [position]="position()"
      (selectCard)="onSelect()"
    />
  `,
})
class TestHostComponent {
  project = signal<ProjectItem>(mockProject);
  variant = signal<'featured' | 'neighbor'>('featured');
  position = signal<'prev' | 'active' | 'next'>('active');
  selected = false;

  onSelect(): void {
    this.selected = true;
  }
}

describe('ProjectCard', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let i18n: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ProjectCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    i18n = TestBed.inject(TranslationService);
    i18n.setLang('pt');
    fixture.detectChanges();
  });

  it('should render featured card with full title, summary, tech, and action links', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.card-featured')).toBeTruthy();
    expect(el.querySelector('.card-title')?.textContent?.trim()).toBe('[Nome do projeto]');
    expect(el.querySelector('.card-summary')?.textContent?.trim()).toContain('Resumo do projeto');
    expect(el.querySelector('.card-tech')?.textContent?.trim()).toBe('C# · ASP.NET Core');

    const links = el.querySelectorAll<HTMLAnchorElement>('.card-actions .card-link');
    expect(links.length).toBe(2);
    expect(links[0].href).toBe('https://github.com/BernardoFM1/test-project');
  });

  it('should display discreet portuguese notice when in English mode', () => {
    i18n.setLang('en');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const notice = el.querySelector('.pt-notice');
    expect(notice).toBeTruthy();
    expect(notice?.textContent?.trim()).toBe('Conteúdo em português');
  });

  it('should fallback to formatted topics when languages is empty', () => {
    host.project.set({
      slug: 'stub-project',
      title: 'Projeto Stub',
      summary: 'Resumo do projeto stub.',
      url: 'https://github.com/BernardoFM1/stub-project',
      languages: [],
      topics: ['typescript'],
      pushedAt: '2026-10-01T12:00:00Z',
    });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.card-tech')?.textContent?.trim()).toBe('TypeScript');
  });

  it('should render neighbor card and emit selectCard on click', () => {
    host.variant.set('neighbor');
    host.position.set('next');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const neighbor = el.querySelector<HTMLElement>('.card-neighbor');
    expect(neighbor).toBeTruthy();
    expect(el.querySelector('.card-actions')).toBeNull();

    neighbor?.click();
    expect(host.selected).toBe(true);
  });
});
