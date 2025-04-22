import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrSurveyPageComponent } from './qr-survey-page.component';

describe('QrSurveyPageComponent', () => {
  let component: QrSurveyPageComponent;
  let fixture: ComponentFixture<QrSurveyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrSurveyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrSurveyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
