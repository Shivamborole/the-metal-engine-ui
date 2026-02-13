import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DCNumber } from './dc-number';

describe('DCNumber', () => {
  let component: DCNumber;
  let fixture: ComponentFixture<DCNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DCNumber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DCNumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
