import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { Survey } from '../../models/survey.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-survey-question-result-box',
  standalone: true,
  imports: [MatPaginator,
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
  templateUrl: './survey-question-result-box.component.html',
  styleUrls: ['./survey-question-result-box.component.scss']
})
export class SurveyQuestionResultBoxComponent {
  // Eingabedaten: Array von Umfragen, das im Template verwendet wird
  @Input() data: Survey[] = [];

  // Steuerung: Soll der "Abschließen"-Button angezeigt werden?
  @Input() showCompleteButton: boolean = false;

  // Ausgabe-Event: Wird ausgelöst, wenn eine Umfrage abgeschlossen wird
  @Output() complete = new EventEmitter<Survey>();

  // Für die Tab-Gruppierung der Fragetypen
  selectedAnswerTypeIndex = 0;

  constructor(private dialog: MatDialog) {}

  /**
   * Öffnet einen Bestätigungsdialog und feuert bei Bestätigung das `complete`-Event
   */
  completeSurvey(survey: Survey): void {
    console.log('completeSurvey wurde aufgerufen');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true
    });

    console.log('Dialog wurde geöffnet:', dialogRef);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog geschlossen, Ergebnis:', result);

      if (result === true) {
        console.log('Benutzer hat bestätigt – Umfrage wird abgeschlossen');
        this.complete.emit(survey); // Event an Parent-Komponente senden
      } else {
        console.log('Benutzer hat abgebrochen – Umfrage wird **nicht** abgeschlossen');
      }
    });
  }

  /**
   * Simuliert ein Update der Umfrage-Ergebnisse (z. B. durch Backend-Aktualisierung)
   */
  updateSurveyResults(survey: Survey): void {
    console.log('Aktualisiere Umfrage:', survey.title);

    // Nur Checkbox-Ergebnisse werden simuliert
    survey.questions.forEach((question) => {
      if (question.answerType === 'checkbox' && question.optionPercentages) {
        question.optionPercentages = question.optionPercentages.map(() => Math.floor(Math.random() * 100));
      }
    });

    console.log('Aktualisierte Umfrage:', JSON.stringify(survey, null, 2));
  }
}
