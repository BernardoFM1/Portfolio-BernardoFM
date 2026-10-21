import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
    doc = TestBed.inject(DOCUMENT);
  });

  it('should default to Portuguese (pt)', () => {
    expect(service.currentLang()).toBe('pt');
    expect(service.t().nav.projects).toBe('Projetos');
    expect(doc.documentElement.lang).toBe('pt');
  });

  it('should switch to English (en) and update document lang attribute', () => {
    service.setLang('en');
    expect(service.currentLang()).toBe('en');
    expect(service.t().nav.projects).toBe('Projects');
    expect(doc.documentElement.lang).toBe('en');
  });

  it('should switch back to Portuguese (pt)', () => {
    service.setLang('en');
    service.setLang('pt');
    expect(service.currentLang()).toBe('pt');
    expect(service.t().nav.projects).toBe('Projetos');
    expect(doc.documentElement.lang).toBe('pt');
  });
});
