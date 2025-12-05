import { TestBed } from '@angular/core/testing';

import { InvoiceNumberSetting } from './invoice-number-setting';

describe('InvoiceNumberSetting', () => {
  let service: InvoiceNumberSetting;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceNumberSetting);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
