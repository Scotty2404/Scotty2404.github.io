import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Für ngModel und die Bindung von Werten
import { MatFormFieldModule } from '@angular/material/form-field';  // Für das MatFormField
import { MatInputModule } from '@angular/material/input';  // Für Input-Elemente
import { MatSelectModule } from '@angular/material/select';  // Für Select-Elemente
import { MatSliderModule } from '@angular/material/slider';  // Für den Slider
import { MatCardModule } from '@angular/material/card';  // Für Card-Komponenten
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlider } from '@angular/material/slider';


@Component({
  selector: 'app-qr-survey-page',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSlider
  ],
  templateUrl: './qr-survey-page.component.html',
  styleUrl: './qr-survey-page.component.scss'
})
export class QrSurveyPageComponent {
  checkboxOptions = ['Option A', 'Option B', 'Option C'];
  surveyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.surveyForm = this.fb.group({
      checkboxQuestion: this.fb.array(this.checkboxOptions.map(() => this.fb.control(false))),
      openAnswer: [''],
      scale: [null]
    });
  }

  get checkboxFormArray(): FormArray {
    return this.surveyForm.get('checkboxQuestion') as FormArray;
  }

  getCheckboxControl(i: number): FormControl {
    return this.checkboxFormArray.at(i) as FormControl;
  }
  
  
  onSubmit(): void {
    console.log(this.surveyForm.value);
  }

  
}