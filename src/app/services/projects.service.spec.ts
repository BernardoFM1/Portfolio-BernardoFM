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
    const list = service.projects();
    // projeto-2 tem priority 1, projeto-1 tem priority 2 no sample overrides
    expect(list[0].slug).toBe('projeto-2');
    expect(list[1].slug).toBe('projeto-1');
  });

  it('should sort remaining projects by pushedAt descending', () => {
    const list = service.projects();
    const nonPriority = list.filter((p) => p.priority === undefined);

    for (let i = 0; i < nonPriority.length - 1; i++) {
      const timeCurrent = new Date(nonPriority[i].pushedAt).getTime();
      const timeNext = new Date(nonPriority[i + 1].pushedAt).getTime();
      expect(timeCurrent).toBeGreaterThanOrEqual(timeNext);
    }
  });
});
