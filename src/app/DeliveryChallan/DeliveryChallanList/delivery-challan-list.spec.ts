import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChallan } from './delivery-challan-list';

describe('DeliveryChallan', () => {
  let component: DeliveryChallan;
  let fixture: ComponentFixture<DeliveryChallan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryChallan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryChallan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
