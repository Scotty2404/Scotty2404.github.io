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
      // Für Multiple Choice mindestens eine Antwort
      if (answersArray.length === 0) {
        answersArray.push(new FormControl('', Validators.required));
      }
    } else {
      // Für andere Typen keine Antworten
      answersArray.clear();
    }
  }
  

  
}