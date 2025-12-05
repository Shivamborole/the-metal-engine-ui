import { TestBed } from '@angular/core/testing';

import { PdfTemplateService } from './pdf-template-service';

describe('PdfTemplateService', () => {
  let service: PdfTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
