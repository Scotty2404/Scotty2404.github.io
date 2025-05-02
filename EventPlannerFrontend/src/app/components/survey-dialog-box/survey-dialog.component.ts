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
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Definiert die SurveyDialog-Komponente
@Component({
  selector: 'app-survey-dialog', // Der Selector, der im HTML verwendet wird, um diese Komponente einzufügen.
  standalone: true, // Gibt an, dass diese Komponente eine Standalone-Komponente ist und keine Abhängigkeiten von anderen Modulen benötigt.
  imports: [  // Importierte Module für das Styling und die Funktionalität der Komponente
    MatDialogModule,
    MatFormFieldModule,
    CommonModule, // Bietet grundlegende Angular-Funktionen
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatList,
    MatListItem,
    MatIcon,
    MatSelectModule,
    MatButtonToggleModule,
  ],
  templateUrl: './survey-dialog.component.html',  // Der Pfad zur HTML-Vorlage für den Dialog
  styleUrls: ['./survey-dialog.component.scss']  // Der Pfad zu den Styles für den Dialog
})
export class SurveyDialogComponent {
  // Initialisierung des Umfrage-Objekts mit einem leeren Titel und einer leeren Fragenliste
  survey = { title: '', questions: [] as Question[] };  

  newQuestion: Question = {
    text: '',  // Fragetext
    answerType: 'checkbox',  // Standard-Fragetyp: 'checkbox'
    options: [],  // Optionen für die Frage, wenn sie eine Checkbox-Frage ist.
    optionPercentages: [],   // Prozentuale Verteilung der Optionen
    multipleSelection: 0  // Add this property with default value false
  };

  // Variable, um die Optionen als String zu speichern und später in ein Array zu konvertieren
  optionsAsString = '';  

  // Variablen, um Fehler zu verfolgen, die bei der Eingabe auftreten (für Checkboxen, Skalen und den Fragetext)
  showOptionError = false;
  showScaleError = false;
  showTextError = false;

  constructor(public dialogRef: MatDialogRef<SurveyDialogComponent>) {}  // Referenz zum Dialog, um ihn zu schließen.

  // Diese Methode wird aufgerufen, wenn sich der Options-String ändert.
  onOptionsChange(value: string): void {
    // Der String wird in ein Array von Optionen umgewandelt und überschüssige Leerzeichen werden entfernt.
    this.newQuestion.options = value
      .split(',')  // Der String wird an den Kommas aufgeteilt.
      .map(opt => opt.trim())  // Entfernt führende und abschließende Leerzeichen von jedem Element.
      .filter(Boolean);  // Filtert leere Optionen heraus (z. B. nach doppeltem Komma).
  }

  // Diese Methode wird aufgerufen, wenn der Benutzer eine neue Frage hinzufügen möchte.
  onNextQuestion(): void {
    let hasError = false;

    // Überprüfen, ob der Fragetext leer ist (diese Überprüfung gilt auch für offene Fragen)
    if (!this.newQuestion.text || this.newQuestion.text.trim() === '') {
      this.showTextError = true;
      hasError = true;
    } else {
      this.showTextError = false;
    }

    // Überprüfen, ob bei einer Checkbox-Frage mindestens zwei gültige Optionen angegeben wurden
    if (this.newQuestion.answerType === 'checkbox') {
      this.newQuestion.options = this.newQuestion.options || [];  // Sicherstellen, dass Optionen vorhanden sind
      const validOptions = this.newQuestion.options.filter(option => option && option.trim() !== '');  // Entfernen von leeren Optionen
      if (validOptions.length < 2) {  // Mindestens zwei Optionen sind erforderlich
        this.showOptionError = true;
        hasError = true;
      } else {
        this.showOptionError = false;
        this.newQuestion.options = validOptions;  // Gültige Optionen speichern
      }
    }

    // Überprüfen, ob bei einer Skalenfrage der Skalenwert gesetzt wurde
    if (this.newQuestion.answerType === 'scale') {
      if (this.newQuestion.scaleValue == null) {
        this.showScaleError = true;
        hasError = true;
      } else {
        this.showScaleError = false;
        this.newQuestion.optionPercentages = [this.newQuestion.scaleValue];  // Skalenwert speichern
      }
    }

    // Wenn ein Fehler aufgetreten ist, breche die Methode ab
    if (hasError) {
      return;
    }

    // Frage zur Umfrage hinzufügen
    this.survey.questions.push({ ...this.newQuestion });

    // Zurücksetzen der Eingabefelder für die nächste Frage
    this.newQuestion = {
      text: '',
      answerType: 'checkbox',
      options: [],
      optionPercentages: []
    };
    this.optionsAsString = '';
  }

  // Diese Methode wird aufgerufen, wenn der Benutzer eine Frage aus der Umfrage entfernen möchte.
  removeQuestion(index: number): void {
    this.survey.questions.splice(index, 1);  // Entfernen der Frage an der angegebenen Position im Array
  }

  // Diese Methode wird aufgerufen, wenn der Benutzer den Dialog ohne Speichern schließen möchte.
  onCancel(): void {
    this.dialogRef.close();  // Dialog schließen, ohne etwas zu speichern
  }

  // Diese Methode speichert die Umfrage und übergibt sie beim Schließen des Dialogs.
  onSave(): void {
    // Sicherstellen, dass bei Checkbox-Fragen Optionen vorhanden sind, wenn keine vorhanden sind, setze sie auf ein leeres Array
    if (this.newQuestion.answerType === 'checkbox') {
      this.newQuestion.options = this.newQuestion.options || [];
    }

    // Für Skalierungsfragen speichern wir den Skalenwert, wenn er nicht null ist
    if (this.newQuestion.answerType === 'scale' && this.newQuestion.scaleValue != null) {
      this.newQuestion.optionPercentages = [this.newQuestion.scaleValue];
    }

    // Die letzte Frage zur Umfrage hinzufügen
    this.survey.questions.push(this.newQuestion);

    // Dialog schließen und die Umfrage übergeben
    this.dialogRef.close(this.survey);
  }
}