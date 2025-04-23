import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Für ngModel und die Bindung von Werten
import { MatFormFieldModule } from '@angular/material/form-field';  // Für das MatFormField
import { MatInputModule } from '@angular/material/input';  // Für Input-Elemente
import { MatSelectModule } from '@angular/material/select';  // Für Select-Elemente

import { MatCardModule } from '@angular/material/card';  // Für Card-Komponenten
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';



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
  ],
  templateUrl: './qr-survey-page.component.html',
  styleUrl: './qr-survey-page.component.scss'
})
export class QrSurveyPageComponent {
  checkboxOptions = ['Option A', 'Option B', 'Option C'];

  disabled = false;
  max = 100;
  min = 0;
  step = 1;
  value = 0;

  surveyForm: FormGroup;

  get checkboxes(): FormArray<FormControl> {
    return this.surveyForm.get('checkboxes') as FormArray<FormControl>;
  }

  constructor(private fb: FormBuilder) {
    this.surveyForm = this.fb.group({
      checkboxes: this.fb.array(this.checkboxOptions.map(() => false)),
      openAnswer: [''],
      scale: new FormControl(this.value) // <- das hier fehlt!
    });
    
  }
  onSubmit() {
    const rawValues = this.surveyForm.value;
    const selectedOptions = this.checkboxOptions.filter((option, i) => rawValues.checkboxes[i]);
    console.log('Ausgewählte Optionen:', selectedOptions);
    console.log('Offene Antwort:', rawValues.openAnswer);
    console.log('Skalenwert:', rawValues.scale);
  }
}