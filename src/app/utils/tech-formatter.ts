const KNOWN_TECHNOLOGIES: Record<string, string> = {
  csharp: 'C#',
  cs: 'C#',
  dotnet: '.NET',
  dotnetcore: '.NET',
  'dotnet-core': '.NET',
  aspnet: 'ASP.NET',
  aspnetcore: 'ASP.NET Core',
  'aspnet-core': 'ASP.NET Core',
  efcore: 'EF Core',
  'entity-framework': 'Entity Framework',
  blazor: 'Blazor',
  maui: '.NET MAUI',
  wpf: 'WPF',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  js: 'JavaScript',
  node: 'Node.js',
  nodejs: 'Node.js',
  react: 'React',
  reactjs: 'React',
  angular: 'Angular',
  vue: 'Vue.js',
  vuejs: 'Vue.js',
  nextjs: 'Next.js',
  next: 'Next.js',
  nestjs: 'NestJS',
  express: 'Express',
  expressjs: 'Express',
  python: 'Python',
  django: 'Django',
  fastapi: 'FastAPI',
  flask: 'Flask',
  html: 'HTML',
  html5: 'HTML5',
  css: 'CSS',
  css3: 'CSS3',
  sass: 'Sass',
  scss: 'Sass',
  tailwind: 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
  bootstrap: 'Bootstrap',
  sql: 'SQL',
  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
  sqlite: 'SQLite',
  sqlserver: 'SQL Server',
  'sql-server': 'SQL Server',
  mssql: 'SQL Server',
  mongodb: 'MongoDB',
  mongo: 'MongoDB',
  redis: 'Redis',
  graphql: 'GraphQL',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  k8s: 'Kubernetes',
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'GCP',
  linux: 'Linux',
  rabbitmq: 'RabbitMQ',
  kafka: 'Kafka',
  git: 'Git',
  'github-actions': 'GitHub Actions',
  api: 'REST API',
  rest: 'REST API',
  'rest-api': 'REST API',
  grpc: 'gRPC',
  golang: 'Go',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  kotlin: 'Kotlin',
  swift: 'Swift',
  php: 'PHP',
  ruby: 'Ruby',
  cpp: 'C++',
  cplusplus: 'C++',
  dart: 'Dart',
  flutter: 'Flutter',
};

export function formatTechnology(topic: string): string {
  if (!topic) return '';
  const trimmed = topic.trim();
  const lower = trimmed.toLowerCase();
  if (KNOWN_TECHNOLOGIES[lower]) {
    return KNOWN_TECHNOLOGIES[lower];
  }

  const words = trimmed.replace(/[-_]/g, ' ').split(/\s+/).filter(Boolean);
  return words
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');
}

export function getProjectTechnologies(project: {
  languages?: string[];
  topics?: string[];
}): string[] {
  if (project.languages && project.languages.length > 0) {
    return project.languages;
  }
  if (project.topics && project.topics.length > 0) {
    return project.topics.map(formatTechnology).filter(Boolean);
  }
  return [];
}
