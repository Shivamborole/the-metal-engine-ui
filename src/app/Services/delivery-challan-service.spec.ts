import { TestBed } from '@angular/core/testing';

import { DeliveryChallanService } from './delivery-challan-service';

describe('DeliveryChallanService', () => {
  let service: DeliveryChallanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryChallanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
