import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChallanCreate } from './delivery-challan-create';

describe('DeliveryChallanCreate', () => {
  let component: DeliveryChallanCreate;
  let fixture: ComponentFixture<DeliveryChallanCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryChallanCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryChallanCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
