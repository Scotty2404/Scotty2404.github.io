import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

// Definiere die Typen für Fragen
interface Question {
  question: string;
  options: string[];
}

@Component({
  selector: 'app-survey-dialog',
  standalone: true, // Wenn du Standalone-Komponenten verwendest
  imports: [MatDialogModule,
            MatFormFieldModule,
            BrowserModule,
            ReactiveFormsModule,
            MatInputModule,
            MatButtonModule,
            FormsModule,
  ], // Importiere das MatDialogModule hier
  templateUrl: './survey-dialog.component.html',
  styleUrls: ['./survey-dialog.component.scss']
})
export class SurveyDialogComponent {
  survey = { title: '', questions: [] as Question[] }; // Typisiere das questions-Array
  newQuestion: { question: string; options: string[] } = { question: '', options: [] };

  constructor(public dialogRef: MatDialogRef<SurveyDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.survey);
  }

  addQuestion() {
    this.survey.questions.push({ question: '', options: [] }); // Jetzt weiß TypeScript, dass options ein Array von Strings ist
  }

  editQuestion(question: { question: string; options: string[] }) {
    this.newQuestion = { ...question }; // Setze newQuestion auf die zu bearbeitende Frage
  }

  deleteQuestion(question: { question: string; options: string[] }) {
    const index = this.survey.questions.indexOf(question);
    if (index >= 0) {
      this.survey.questions.splice(index, 1); // Entferne die Frage aus dem Array
    }
  }

}