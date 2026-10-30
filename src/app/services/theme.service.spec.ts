import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let doc: Document;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    doc = TestBed.inject(DOCUMENT);
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with a valid theme and set document attribute', () => {
    const current = service.currentTheme();
    expect(['light', 'dark']).toContain(current);
    expect(doc.documentElement.getAttribute('data-theme')).toBe(current);
    expect(doc.documentElement.style.colorScheme).toBe(current);
  });

  it('should toggle theme between dark and light', () => {
    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');
    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');

    service.toggleTheme();
    expect(service.currentTheme()).toBe('light');
    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem(service.storageKey)).toBe('light');

    service.toggleTheme();
    expect(service.currentTheme()).toBe('dark');
    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(service.storageKey)).toBe('dark');
  });

  it('should explicitly set theme and persist to localStorage', () => {
    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
    expect(localStorage.getItem(service.storageKey)).toBe('light');

    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');
    expect(localStorage.getItem(service.storageKey)).toBe('dark');
  });
});

