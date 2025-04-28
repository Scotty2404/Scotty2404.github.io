import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrSurveyDialogComponent } from './qr-survey-dialog.component';

describe('QrSurveyDialogComponent', () => {
  let component: QrSurveyDialogComponent;
  let fixture: ComponentFixture<QrSurveyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrSurveyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrSurveyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
