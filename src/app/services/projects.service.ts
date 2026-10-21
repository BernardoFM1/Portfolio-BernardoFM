import { Injectable, signal } from '@angular/core';
import generatedData from '../../content/projects.generated.json';
import overridesData from '../../content/projects.overrides.json';
import { ProjectGenerated, ProjectOverride, ProjectItem } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly rawGenerated: ProjectGenerated[] = generatedData as ProjectGenerated[];
  private readonly rawOverrides: ProjectOverride[] = overridesData as ProjectOverride[];

  readonly projects = signal<ProjectItem[]>(this.processProjects());

  processProjects(
    generated: ProjectGenerated[] = this.rawGenerated,
    overrides: ProjectOverride[] = this.rawOverrides
  ): ProjectItem[] {
    const overridesMap = new Map<string, ProjectOverride>();
    for (const override of overrides) {
      overridesMap.set(override.slug, override);
    }

    const visibleProjects: ProjectItem[] = [];

    for (const item of generated) {
      const override = overridesMap.get(item.slug);
      if (override?.hidden) {
        continue;
      }

      visibleProjects.push({
        ...item,
        priority: override?.priority,
      });
    }

    return visibleProjects.sort((a, b) => {
      const hasPriorityA = typeof a.priority === 'number';
      const hasPriorityB = typeof b.priority === 'number';

      if (hasPriorityA && hasPriorityB) {
        return (a.priority as number) - (b.priority as number);
      }
      if (hasPriorityA) {
        return -1;
      }
      if (hasPriorityB) {
        return 1;
      }

      const dateA = new Date(a.pushedAt).getTime();
      const dateB = new Date(b.pushedAt).getTime();
      return dateB - dateA;
    });
  }
}
