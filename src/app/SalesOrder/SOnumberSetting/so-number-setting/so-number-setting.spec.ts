import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoNumberSetting } from './so-number-setting';

describe('SoNumberSetting', () => {
  let component: SoNumberSetting;
  let fixture: ComponentFixture<SoNumberSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoNumberSetting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoNumberSetting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
