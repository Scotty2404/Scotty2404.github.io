import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionBoxComponent } from './survey-question-box.component';

describe('SurveyQuestionBoxComponent', () => {
  let component: SurveyQuestionBoxComponent;
  let fixture: ComponentFixture<SurveyQuestionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyQuestionBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyQuestionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
