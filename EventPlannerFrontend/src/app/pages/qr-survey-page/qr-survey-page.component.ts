import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
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
    MatRadioModule,
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
    private apiService: ApiService,
    private dialog: MatDialog
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
          // Start with the minimum value instead of null
          const minValue = question.minValue || 1;
          answersGroup.addControl(question.id.toString(), new FormControl(minValue));
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
      const formattedAnswers: Record<string, number | number[] | string> = {};
  
      this.survey.questions.forEach((question: any) => {
        const questionId = question.id.toString();
        const control = answersGroup.get(questionId);
  
        if (question.type === 'multiple' && question.multipleSelection) {
          // For multiple selection, collect indices of selected options
          const selectedIndices: number[] = [];
          const formArray = control as FormArray;
          
          // Only add indices where the value is true (checked)
          formArray.controls.forEach((ctrl, index) => {
            if (ctrl.value === true) {
              selectedIndices.push(index);
            }
          });
          
          // Only include the field if at least one option is selected
          if (selectedIndices.length > 0) {
            formattedAnswers[questionId] = selectedIndices;
          }
        } else if (question.type === 'multiple' && !question.multipleSelection) {
          // For single selection radio buttons, just use the value directly
          // Only include if a value was selected
          if (control?.value !== null && control?.value !== undefined) {
            formattedAnswers[questionId] = control?.value;
          }
        } else if (question.type === 'scale') {
          const value = control?.value;
          if (value !== null && value !== undefined) {
            // For scale questions, we need to ensure the value is within the valid range
            // and convert it to a format the backend expects
            
            // Get min and max values for this question
            const minValue = question.minValue || 1;
            const maxValue = question.maxValue || 5;
            
            // Ensure value is within range
            let scaledValue = Math.min(Math.max(Number(value), minValue), maxValue);
            
            // The API expects values as direct answers, not indices
            formattedAnswers[questionId] = scaledValue;
            
            // Log for debugging
            console.log(`Scale question ${questionId} value:`, scaledValue);
          }
        } else {
          // For text questions, include only if not empty
          const value = control?.value;
          if (value !== null && value !== undefined && value !== '') {
            formattedAnswers[questionId] = value;
          }
        }
      });
  
      console.log('Formatted answers:', formattedAnswers);
  
      // Only submit if we have at least one answer
      if (Object.keys(formattedAnswers).length > 0) {
        // Send answers to the backend
        this.apiService.submitSurveyResponse(this.survey.id, formattedAnswers).subscribe({
          next: () => {
            this.submitted = true;
            // Open success dialog
            this.dialog.open(QrSurveyDialogComponent, {
              width: '400px'
            });
          },
          error: (error) => {
            console.error('Error submitting survey:', error);
            this.error = 'Fehler beim Senden der Umfrage: ' + (error.error?.message || 'Unbekannter Fehler');
          }
        });
      } else {
        this.error = 'Bitte beantworte mindestens eine Frage.';
      }
    } else {
      this.error = 'Bitte überprüfe deine Antworten.';
    }
  }
}