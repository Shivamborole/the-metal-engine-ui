import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePdfTemplate } from './invoice-pdf-template';

describe('InvoicePdfTemplate', () => {
  let component: InvoicePdfTemplate;
  let fixture: ComponentFixture<InvoicePdfTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePdfTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicePdfTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
