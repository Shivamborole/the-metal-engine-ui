import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderCreateComponent } from './sales-order-create';

describe('SalesOrderCreate', () => {
  let component: SalesOrderCreateComponent;
  let fixture: ComponentFixture<SalesOrderCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesOrderCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
