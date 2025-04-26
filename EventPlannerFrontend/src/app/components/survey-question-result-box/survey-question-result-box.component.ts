import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator'; // Material Design Paginator
import { MatSort } from '@angular/material/sort'; // Material Design Sortierfunktion
import { MatFormFieldModule } from '@angular/material/form-field'; // Form-Field Modul
import { MatLabel } from '@angular/material/form-field'; // Material Label
import { MatIcon } from '@angular/material/icon'; // Material Icon
import { MatPaginatorModule } from '@angular/material/paginator'; // Paginator Modul
import { MatTableModule } from '@angular/material/table'; // Material Table Modul
import { MatButtonModule } from '@angular/material/button'; // Material Button Modul
import { MatCardModule } from '@angular/material/card'; // Material Card Modul
import { MatTabsModule } from '@angular/material/tabs'; // Material Tabs Modul
import { MatCheckboxModule } from '@angular/material/checkbox'; // Material Checkbox Modul
import { MatInputModule } from '@angular/material/input'; // Material Input Modul
import { MatSliderModule } from '@angular/material/slider'; // Material Slider Modul
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Material ProgressBar Modul
import { MatListModule } from '@angular/material/list'; // Material List Modul
import { Survey } from '../../models/survey.model'; // Survey-Modell für Umfragen
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // Bestätigungsdialog-Komponente
import { MatDialog } from '@angular/material/dialog'; // Dialog-Modul von Material Design
import { ChangeDetectorRef } from '@angular/core'; // Für manuelles Triggern der Änderungserkennung

@Component({
  selector: 'app-survey-question-result-box', // Der Selektor für das Komponententemplate
  standalone: true, // Standalone-Komponente
  imports: [
    // Die Module, die in der Komponente verwendet werden
    MatPaginator,
    MatSort,
    CommonModule,
    MatFormFieldModule,
    MatLabel,
    MatIcon,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatCheckboxModule,
    MatInputModule,
    MatSliderModule,
    MatProgressBarModule,
    MatListModule,
    ConfirmDialogComponent
  ],
  templateUrl: './survey-question-result-box.component.html', // Das zugehörige HTML-Template
  styleUrls: ['./survey-question-result-box.component.scss'] // Das zugehörige CSS-Styling
})
export class SurveyQuestionResultBoxComponent {
  // Eingabedaten (Input), die vom Parent übergeben werden
  @Input() data: Survey[] = []; // Array von Umfragen (Survey) für die Anzeige der Fragen und Ergebnisse

  // Steuerung, ob der "Abschließen"-Button angezeigt wird
  @Input() showCompleteButton: boolean = false; // Boolean für die Sichtbarkeit des Buttons

  // Ausgabe-Event (Output) für das Abschließen der Umfrage
  @Output() complete = new EventEmitter<Survey>(); // Event, das ausgelöst wird, wenn eine Umfrage abgeschlossen wird

  // Variable für die Auswahl des Fragetyp-Tabs (zum Beispiel Checkbox, Skala, etc.)
  selectedAnswerTypeIndex = 0;

  // Konstruktor, um den Dialog und ChangeDetectorRef zu initialisieren
  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  /**
   * Diese Methode öffnet einen Bestätigungsdialog, um die Umfrage abzuschließen.
   * Falls der Benutzer bestätigt, wird das 'complete' Event ausgelöst.
   */
  completeSurvey(survey: Survey): void {
    console.log('completeSurvey wurde aufgerufen');

    // Öffnen des Bestätigungsdialogs
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px', // Breite des Dialogs
      disableClose: true // Dialog kann nur durch Bestätigung geschlossen werden
    });

    console.log('Dialog wurde geöffnet:', dialogRef);

    // Beobachten, ob der Dialog geschlossen wurde und das Ergebnis (bestätigt oder abgebrochen) auswerten
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog geschlossen, Ergebnis:', result);

      // Wenn der Benutzer bestätigt hat
      if (result === true) {
        console.log('Benutzer hat bestätigt – Umfrage wird abgeschlossen');
        this.complete.emit(survey); // Das 'complete' Event wird ausgelöst und die Umfrage wird zurückgegeben
      } else {
        console.log('Benutzer hat abgebrochen – Umfrage wird **nicht** abgeschlossen');
      }
    });
  }

  /**
   * Diese Methode simuliert das Aktualisieren der Umfrageergebnisse,
   * die Werte werden randomisiert, um einen dynamischen Test zu ermöglichen.
   */
  updateSurveyResults(survey: Survey): void {
    console.log('Aktualisiere Umfrage:', survey.title);

    // Gehe durch alle Fragen der Umfrage und aktualisiere die Ergebnisse
    survey.questions.forEach((question) => {
      if (question.answerType === 'checkbox' && question.optionPercentages) {
        // Bei Checkbox-Fragen: Generiere zufällige Prozentwerte
        question.optionPercentages = question.optionPercentages.map(() => Math.floor(Math.random() * 100));
      } 
      else if (question.answerType === 'open') {
        // Bei offenen Fragen: Füge zufällige Textantworten hinzu, falls keine vorhanden sind
        if (!question.answerField) {
          question.answerField = [];
        }
        question.answerField = [
          'Sehr gute Veranstaltung!',
          'Könnte besser organisiert sein.',
          'Tolle Location!',
          'Essen war hervorragend.',
          'Mehr Pausen wären schön gewesen.'
        ];
      }
      else if (question.answerType === 'scale') {
        // Bei Skalenfragen: Generiere zufällige Skalenwerte (zwischen 1 und 5) und Antwortprozentsatz
        question.scaleValue = Math.floor(Math.random() * 5) + 1; // Wert zwischen 1 und 5
        question.answerPercentage = Math.floor(Math.random() * 100); // Prozentwert zwischen 0 und 100
      }
    });

    // Ausgabe der aktualisierten Umfrage-Daten (zu Debugging-Zwecken)
    console.log('Aktualisierte Umfrage:', JSON.stringify(survey, null, 2));

    // Manuelles Auslösen der Änderungserkennung, um die UI zu aktualisieren
    this.cdr.detectChanges();
  }
}