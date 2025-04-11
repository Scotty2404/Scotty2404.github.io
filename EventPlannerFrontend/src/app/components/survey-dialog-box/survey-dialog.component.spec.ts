import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyDialogComponent } from "./survey-dialog.component";
import { MatDialogRef } from '@angular/material/dialog';

describe('SurveyDialogComponent', () => {
  let component: SurveyDialogComponent;
  let fixture: ComponentFixture<SurveyDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SurveyDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      declarations: [SurveyDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should close dialog with survey data on save', () => {
    component.survey.title = 'Test Umfrage';
    component.addQuestion(); // Füge eine Frage hinzu
    component.onSave();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.survey);
  });

  it('should add a question to the survey', () => {
    component.addQuestion();
    expect(component.survey.questions.length).toBe(1);
    expect(component.survey.questions[0]).toEqual({ question: '', options: [] });
  });
});