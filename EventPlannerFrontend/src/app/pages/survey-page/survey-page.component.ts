import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataService } from '../../services/data.service';
import { SurveyDialogComponent } from '../../components/survey-dialog-box/survey-dialog.component';
import { SurveyQuestionResultBoxComponent } from '../../components/survey-question-result-box/survey-question-result-box.component';
import { Survey } from '../../models/survey.model';
import { MatAccordion } from '@angular/material/expansion';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-survey-page',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIcon,
    SurveyQuestionResultBoxComponent,
    MatDialogModule,
    SurveyDialogComponent,
    MatExpansionModule,
    MatAccordion
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survey-page.component.html',
  styleUrls: ['./survey-page.component.scss']
})
export class SurveyPageComponent implements OnInit {
  // Zwei Arrays zur Trennung von laufenden und abgeschlossenen Umfragen
  completedSurveys: Survey[] = [];
  ongoingSurveys: Survey[] = [];

  constructor(
    private dataService: DataService, // Service zum Abrufen von Umfragedaten
    private dialog: MatDialog // Angular Material Dialog-Service
  ) {}

  // Signal zur Kontrolle des Expansion Panels (Angular Signals – reaktiver Zustand)
  panelOpenState = signal(false);

  ngOnInit(): void {
    // Beispielhafte Initialisierung mit Mock-Daten aus dem Service
    this.ongoingSurveys = this.dataService.surveyList.filter(survey => survey.status === 'ongoing');
    this.completedSurveys = this.dataService.surveyList.filter(survey => survey.status === 'completed');
    console.log('Mocked survey data:', this.ongoingSurveys);

    // Alternativ: Echte API-Anfrage (auskommentiert)
    /*
    this.dataService.getSurveyList().subscribe((surveys: Survey[]) => {
      this.ongoingSurveys = surveys.filter(survey => survey.status === 'ongoing');
      this.completedSurveys = surveys.filter(survey => survey.status === 'completed');
    }, error => {
      console.error('Fehler beim Laden der Umfragen:', error);
    });
    */
  }

  // Öffnet den Dialog zum Erstellen einer neuen Umfrage
  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent, {
      width: '600px',
      disableClose: true, // Dialog kann nicht durch Klicken außerhalb geschlossen werden
      data: {} // Daten an den Dialog übergeben (aktuell leer)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New survey created:', result);
        switch (result.status) {
          case 'ongoing':
            this.ongoingSurveys.push(result);
            break;
          case 'completed':
            this.completedSurveys.push(result);
            break;
          default:
            this.ongoingSurveys.push(result);
        }
      }
    });
  }

  // Markiert eine laufende Umfrage als abgeschlossen
  completeSurvey(survey: Survey): void {
    this.dataService.getSurveyResult(survey).subscribe({
      next: (resultSurvey: Survey) => {
        // Entferne aus laufenden Umfragen
        this.ongoingSurveys = this.ongoingSurveys.filter(s => s !== survey);

        // Füge in abgeschlossene Umfragen ein
        this.completedSurveys.push(resultSurvey);
      },
      error: (err) => {
        console.error('Fehler beim Abschließen der Umfrage:', err);
      }
    });
  }
}