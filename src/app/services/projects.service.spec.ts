import { TestBed } from '@angular/core/testing';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsService);
  });

  it('should load projects from generated and overrides', () => {
    const list = service.projects();
    expect(list.length).toBeGreaterThan(0);
  });

  it('should sort priority overrides first in ascending order', () => {
    const mockGenerated = [
      { slug: 'a', title: 'A', summary: '', url: '', languages: [], topics: [], pushedAt: '2026-01-01T00:00:00Z' },
      { slug: 'b', title: 'B', summary: '', url: '', languages: [], topics: [], pushedAt: '2026-01-02T00:00:00Z' },
      { slug: 'c', title: 'C', summary: '', url: '', languages: [], topics: [], pushedAt: '2026-01-03T00:00:00Z' },
    ];
    const mockOverrides = [
      { slug: 'b', priority: 1 },
      { slug: 'a', priority: 2 },
    ];

    const sorted = service.processProjects(mockGenerated, mockOverrides);
    expect(sorted[0].slug).toBe('b');
    expect(sorted[1].slug).toBe('a');
    expect(sorted[2].slug).toBe('c');
  });

  it('should sort remaining projects by pushedAt descending', () => {
    const mockGenerated = [
      { slug: 'old', title: 'Old', summary: '', url: '', languages: [], topics: [], pushedAt: '2025-01-01T00:00:00Z' },
      { slug: 'recent', title: 'Recent', summary: '', url: '', languages: [], topics: [], pushedAt: '2026-06-01T00:00:00Z' },
    ];

    const sorted = service.processProjects(mockGenerated, []);
    expect(sorted[0].slug).toBe('recent');
    expect(sorted[1].slug).toBe('old');
  });

  it('should exclude projects marked as hidden', () => {
    const mockGenerated = [
      { slug: 'visible', title: 'Visible', summary: '', url: '', languages: [], topics: [], pushedAt: '2026-01-01T00:00:00Z' },
      { slug: 'secret', title: 'Secret', summary: '', url: '', languages: [], topics: [], pushedAt: '2026-01-02T00:00:00Z' },
    ];
    const mockOverrides = [
      { slug: 'secret', hidden: true },
    ];

    const sorted = service.processProjects(mockGenerated, mockOverrides);
    expect(sorted.length).toBe(1);
    expect(sorted[0].slug).toBe('visible');
  });
});
