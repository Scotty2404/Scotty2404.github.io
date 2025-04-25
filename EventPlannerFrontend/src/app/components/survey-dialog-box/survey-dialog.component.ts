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
import { Question } from '../../models/survey.model';
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
  // Initialisiere die Umfrage-Objekte
  survey = { title: '', questions: [] as Question[] };  // Umfrage mit Titel und leeren Fragen.
  newQuestion: Question = {  // Eine neue Frage, die vom Benutzer erstellt wird.
    text: '',
    answerType: 'checkbox',  // Standard-Fragetyp ist 'checkbox'.
    options: [],  // Optionen für Checkbox-Fragen.
    optionPercentages: []  // Prozentwerte der Optionen (z. B. für Skalierungsfragen).
  };
  optionsAsString = '';  // Zwischenspeicher für die Optionen als String (z. B. 'Option1, Option2').
  showOptionError = false;  // Fehleranzeige für ungültige Optionen.

  constructor(public dialogRef: MatDialogRef<SurveyDialogComponent>) {}  // DialogRef für das Schließen des Dialogs.

  // Diese Methode wird aufgerufen, wenn sich der Options-String ändert.
  onOptionsChange(value: string): void {
    // Wandelt die Optionen (kommagetrennt) in ein Array um und entfernt überflüssige Leerzeichen.
    this.newQuestion.options = value
      .split(',')
      .map(opt => opt.trim())
      .filter(Boolean);  // Entfernt leere Strings.
  }

  // Diese Methode wird aufgerufen, wenn der Benutzer eine neue Frage hinzufügen möchte.
  onNextQuestion(): void {
    if (!this.newQuestion.text.trim()) return;  // Verhindert das Hinzufügen von leeren Fragen.
  
    // Checkbox-Fragen benötigen mindestens zwei Optionen
    if (
      this.newQuestion.answerType === 'checkbox' &&
      (!this.newQuestion.options || this.newQuestion.options.length < 2)
    ) {
      this.showOptionError = true;  // Zeigt eine Fehlermeldung an, wenn nicht genügend Optionen vorhanden sind.
      return;
    }
  
    // Fehleranzeige zurücksetzen, falls die Optionen gültig sind.
    this.showOptionError = false;
  
    // Skalenfragen müssen einen Wert enthalten.
    if (this.newQuestion.answerType === 'scale' && this.newQuestion.scaleValue == null) return;
  
    // Für Skalenfragen den Antwortwert speichern.
    if (this.newQuestion.answerType === 'scale') {
      this.newQuestion.answerPercentage = this.newQuestion.scaleValue;
    }
  
    // Füge die neue Frage der Umfrage hinzu.
    this.survey.questions.push({ ...this.newQuestion });
  
    // Setze die Eingabewerte zurück.
    this.newQuestion = {
      text: '',
      answerType: 'checkbox',
      options: [],
      optionPercentages: []
    };
    this.optionsAsString = '';  // Leere den String für die Optionen.
  }

  // Diese Methode wird aufgerufen, um eine Frage aus der Umfrage zu entfernen.
  removeQuestion(index: number): void {
    this.survey.questions.splice(index, 1);  // Entferne die Frage an der angegebenen Index-Position.
  }
  
  // Schließe den Dialog ohne etwas zu speichern.
  onCancel(): void {
    this.dialogRef.close();  // Schließe den Dialog.
  }

  // Speichere die Umfrage, wenn alle Fragen hinzugefügt wurden.
  onSave(): void {
    // Überprüfe, ob bei Checkbox-Fragen Optionen vorhanden sind, falls nicht, setze sie auf ein leeres Array.
    if (this.newQuestion.answerType === 'checkbox') {
      this.newQuestion.options = this.newQuestion.options || [];
    }

    // Für Skalierungsfragen den Skalenwert speichern.
    if (this.newQuestion.answerType === 'scale' && this.newQuestion.scaleValue != null) {
      this.newQuestion.answerPercentage = this.newQuestion.scaleValue;
    }

    // Füge die letzte Frage der Umfrage hinzu.
    this.survey.questions.push(this.newQuestion);
    this.dialogRef.close(this.survey);  // Schließe den Dialog und übergib die Umfrage.
  }
}