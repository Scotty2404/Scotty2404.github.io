import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';  // HINZUGEFÜGT
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlider } from '@angular/material/slider';
import { ApiService } from '../../services/api.service';
import { Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QrSurveyDialogComponent } from '../../components/qr-survey-dialog/qr-survey-dialog.component';



@Component({
  selector: 'app-qr-survey-page',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,  // HINZUGEFÜGT
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDividerModule,
    QrSurveyDialogComponent
  ],
  templateUrl: './qr-survey-page.component.html',
  styleUrl: './qr-survey-page.component.scss'
})
export class QrSurveyPageComponent implements OnInit {
  surveyForm: FormGroup;
  survey: any;
  isLoading = true;
  error: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.surveyForm = this.fb.group({
      answers: this.fb.group({})
    });
  }

  ngOnInit(): void {
    // Hole Survey-ID aus der URL
    this.route.queryParams.subscribe(params => {
      const surveyId = params['surveyId'];
      if (surveyId) {
        this.loadSurvey(surveyId);
      } else {
        this.error = 'Keine Survey-ID gefunden';
        this.isLoading = false;
      }
    });
  }

  loadSurvey(surveyId: string) {
    this.apiService.getSurvey(surveyId).subscribe({
      next: (response) => {
        this.survey = response.data;
        this.setupForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading survey:', error);
        this.error = 'Umfrage konnte nicht geladen werden';
        this.isLoading = false;
      }
    });
  }

  setupForm() {
    const answersGroup = this.surveyForm.get('answers') as FormGroup;
    
    this.survey.questions.forEach((question: any) => {
      switch (question.type) {
        case 'multiple':
          if (question.multipleSelection) {
            // Array für Mehrfachauswahl
            const checkboxArray = new FormArray(
              question.options.map(() => new FormControl(false))
            );
            answersGroup.addControl(question.id.toString(), checkboxArray);
          } else {
            // Einzelauswahl
            answersGroup.addControl(question.id.toString(), new FormControl(null));
          }
          break;
        case 'text':
          answersGroup.addControl(question.id.toString(), new FormControl(''));
          break;
        case 'scale':
          answersGroup.addControl(question.id.toString(), new FormControl(question.minValue));
          break;
      }
    });
  }

  getFormArrayControl(questionId: string): FormArray {
    const answersGroup = this.surveyForm.get('answers') as FormGroup;
    return answersGroup.get(questionId.toString()) as FormArray;
  }

  getFormArrayControlAt(questionId: string, index: number): FormControl {
    const formArray = this.getFormArrayControl(questionId);
    return formArray.at(index) as FormControl;
  }

  getFormControl(questionId: string): FormControl {
    const answersGroup = this.surveyForm.get('answers') as FormGroup;
    return answersGroup.get(questionId.toString()) as FormControl;
  }

  onSubmit(): void {
    if (this.surveyForm.valid) {
      const answersGroup = this.surveyForm.get('answers') as FormGroup;
      const formattedAnswers: any = {};

      this.survey.questions.forEach((question: any) => {
        const questionId = question.id.toString();
        const control = answersGroup.get(questionId);

        if (question.type === 'multiple' && question.multipleSelection) {
          // Konvertiere Boolean-Array zu Index-Array
          const selectedIndices = (control as FormArray).controls
            .map((control, index) => control.value ? index : -1)
            .filter(index => index !== -1);
          formattedAnswers[questionId] = selectedIndices;
        } else {
          formattedAnswers[questionId] = control?.value;
        }
      });

      // Sende Antworten an das Backend
      this.apiService.submitSurveyResponse(this.survey.id, formattedAnswers).subscribe({
        next: () => {
          this.submitted = true;
        },
        error: (error) => {
          console.error('Error submitting survey:', error);
          this.error = 'Fehler beim Senden der Umfrage';
        }
      });
    }
  }
}