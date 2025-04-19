import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatList } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { Survey, Question } from '../../models/survey.model';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-survey-dialog',
  standalone: true, // Wenn du Standalone-Komponenten verwendest
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    CommonModule, // Verwende CommonModule statt BrowserModule
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatList,
    MatListItem,
    MatIcon,
    MatSelectModule
  ],
  templateUrl: './survey-dialog.component.html',
  styleUrls: ['./survey-dialog.component.scss']
})

export class SurveyDialogComponent {
  survey = { title: '', questions: [] as Question[] };
  newQuestion: Question = { text: '', answerType: 'checkbox', options: [], optionPercentages: [] };
  optionsAsString = '';
  constructor(public dialogRef: MatDialogRef<SurveyDialogComponent>) {}

  onOptionsChange(value: string): void {
    this.newQuestion.options = value
      .split(',')
      .map(opt => opt.trim())
      .filter(Boolean);
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.newQuestion.answerType === 'checkbox') {
      this.newQuestion.options = this.newQuestion.options || [];
    }

    if (this.newQuestion.answerType === 'scale' && this.newQuestion.scaleValue != null) {
      this.newQuestion.answerPercentage = this.newQuestion.scaleValue;
    }

    this.survey.questions.push(this.newQuestion);
    this.dialogRef.close(this.survey);
  }

}