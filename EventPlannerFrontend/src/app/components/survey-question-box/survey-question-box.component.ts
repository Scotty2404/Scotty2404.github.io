import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgForOf} from '@angular/common';
import { NgModule } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-survey-question-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,
    MatIconModule, MatButtonModule, MatButtonToggleModule],
  templateUrl: './survey-question-box.component.html',
  styleUrl: './survey-question-box.component.scss'
})
export class SurveyQuestionBoxComponent {
  @Input() questionForm!: FormGroup;
  @Input() questionIndex!: number;
  @Input() removeQuestion!: (index: number) => void;
  @Input() addAnswer!: (index: number) => void;


  

  getAnswers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }
  

  
  removeAnswer(answerIndex: number) {
    this.getAnswers().removeAt(answerIndex);

  }

  

  
}