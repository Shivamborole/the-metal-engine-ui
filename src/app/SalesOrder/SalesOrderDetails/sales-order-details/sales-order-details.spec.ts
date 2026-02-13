import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderDetails } from './sales-order-details';

describe('SalesOrderDetails', () => {
  let component: SalesOrderDetails;
  let fixture: ComponentFixture<SalesOrderDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesOrderDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
