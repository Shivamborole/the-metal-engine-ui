import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionNotePdfTemplate } from './rejection-note-pdf-template';

describe('RejectionNotePdfTemplate', () => {
  let component: RejectionNotePdfTemplate;
  let fixture: ComponentFixture<RejectionNotePdfTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionNotePdfTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionNotePdfTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
