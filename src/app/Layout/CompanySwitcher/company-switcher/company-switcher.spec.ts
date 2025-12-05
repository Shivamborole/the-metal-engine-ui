import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySwitcher } from '../company-switcher/company-switcher';

describe('CompanySwitcher', () => {
  let component: CompanySwitcher;
  let fixture: ComponentFixture<CompanySwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySwitcher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySwitcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
