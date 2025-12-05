import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceNumberSetting } from './invoice-number-setting';

describe('InvoiceNumberSetting', () => {
  let component: InvoiceNumberSetting;
  let fixture: ComponentFixture<InvoiceNumberSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceNumberSetting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceNumberSetting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
