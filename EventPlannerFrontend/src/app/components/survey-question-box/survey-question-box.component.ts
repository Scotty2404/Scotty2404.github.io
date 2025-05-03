import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormArray, FormGroup,  Validators, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgForOf} from '@angular/common';
import { NgModule } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import { NgModel } from '@angular/forms';



@Component({
  selector: 'app-survey-question-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,
    MatIconModule, MatButtonModule, MatButtonToggleModule, MatSelectModule, MatSliderModule],
  templateUrl: './survey-question-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './survey-question-box.component.scss'
})

export class SurveyQuestionBoxComponent {
  @Input() questionForm!: FormGroup;
  @Input() questionIndex!: number;
  @Input() removeQuestion!: (index: number) => void;
  @Input() addAnswer!: (index: number) => void;


  selectedValue = 'multiple'; // Standardmäßig ausgewählter Wert
  options = [
    { value: 'multiple', viewValue: 'Multiple Choice Frage' },
    { value: 'scale', viewValue: 'Skala Frage' },
    { value: 'text', viewValue: 'Freitext Frage' },

  ];

  selectedtoggle = 'option1';


  

  getAnswers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }


  
  removeAnswer(answerIndex: number) {
    this.getAnswers().removeAt(answerIndex);

  }

  ngOnInit() {
    // Initialisiere multipleSelection FormControl, falls nicht vorhanden
    if (!this.questionForm.get('multipleSelection')) {
      this.questionForm.addControl('multipleSelection', new FormControl(false));
    }
    
    // Synchronisiere selectedValue mit dem Formular
    const answerType = this.questionForm.get('answerType')?.value;
    if (answerType) {
      this.selectedValue = answerType;
    }
    
    // Auf Änderungen des answerType reagieren
    this.questionForm.get('answerType')?.valueChanges.subscribe(value => {
      this.selectedValue = value;
      this.handleAnswerTypeChange(value);
    });
  }
  
  private handleAnswerTypeChange(value: string) {
    const answersArray = this.questionForm.get('answers') as FormArray;
    
    if (value === 'multiple') {
      // For Multiple Choice at least one answer
      if (answersArray.length === 0) {
        answersArray.push(new FormControl('', Validators.required));
      }
      
      // Make sure min/max values are available but not required
      if (!this.questionForm.get('minValue')) {
        this.questionForm.addControl('minValue', new FormControl(1));
      }
      if (!this.questionForm.get('maxValue')) {
        this.questionForm.addControl('maxValue', new FormControl(5));
      }
    } else if (value === 'scale') {
      // For scale questions, ensure min/max are added and required
      if (!this.questionForm.get('minValue')) {
        this.questionForm.addControl('minValue', new FormControl(1, Validators.required));
      }
      if (!this.questionForm.get('maxValue')) {
        this.questionForm.addControl('maxValue', new FormControl(5, Validators.required));
      }
      
      // Clear answers as they're not needed for scale
      answersArray.clear();
    } else {
      // For other types no answers needed
      answersArray.clear();
    }
  }
  

  
}