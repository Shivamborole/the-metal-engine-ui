import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChallanPdfTemplate } from './delivery-challan-pdf-template';

describe('DeliveryChallanPdfTemplate', () => {
  let component: DeliveryChallanPdfTemplate;
  let fixture: ComponentFixture<DeliveryChallanPdfTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryChallanPdfTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryChallanPdfTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
