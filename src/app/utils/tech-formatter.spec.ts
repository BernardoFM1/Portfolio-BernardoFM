import { formatTechnology, getProjectTechnologies } from './tech-formatter';

describe('tech-formatter', () => {
  describe('formatTechnology', () => {
    it('should format known technologies to canonical forms', () => {
      expect(formatTechnology('typescript')).toBe('TypeScript');
      expect(formatTechnology('csharp')).toBe('C#');
      expect(formatTechnology('dotnet')).toBe('.NET');
      expect(formatTechnology('aspnetcore')).toBe('ASP.NET Core');
      expect(formatTechnology('aspnet-core')).toBe('ASP.NET Core');
      expect(formatTechnology('python')).toBe('Python');
      expect(formatTechnology('docker')).toBe('Docker');
      expect(formatTechnology('postgresql')).toBe('PostgreSQL');
      expect(formatTechnology('react')).toBe('React');
      expect(formatTechnology('angular')).toBe('Angular');
    });

    it('should humanize unknown topics with hyphens or underscores', () => {
      expect(formatTechnology('clean-architecture')).toBe('Clean Architecture');
      expect(formatTechnology('microservices')).toBe('Microservices');
      expect(formatTechnology('event_driven')).toBe('Event Driven');
    });

    it('should handle empty input gracefully', () => {
      expect(formatTechnology('')).toBe('');
    });
  });

  describe('getProjectTechnologies', () => {
    it('should return languages when languages array is non-empty', () => {
      const result = getProjectTechnologies({
        languages: ['Python'],
        topics: ['python', 'automation'],
      });
      expect(result).toEqual(['Python']);
    });

    it('should fallback to formatted topics when languages is empty', () => {
      const result = getProjectTechnologies({
        languages: [],
        topics: ['typescript', 'angular'],
      });
      expect(result).toEqual(['TypeScript', 'Angular']);
    });

    it('should return empty array when both are empty or undefined', () => {
      expect(getProjectTechnologies({})).toEqual([]);
      expect(getProjectTechnologies({ languages: [], topics: [] })).toEqual([]);
    });
  });
});
