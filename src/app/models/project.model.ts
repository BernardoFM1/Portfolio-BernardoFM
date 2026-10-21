export interface ProjectGenerated {
  slug: string;
  title: string;
  summary: string;
  url: string;
  languages: string[];
  topics: string[];
  pushedAt: string;
}

export interface ProjectOverride {
  slug: string;
  priority?: number;
  hidden?: boolean;
}

export interface ProjectItem extends ProjectGenerated {
  priority?: number;
}
