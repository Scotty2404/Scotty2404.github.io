// Importieren der grundlegenden Angular-Funktionalitäten und Material-Komponenten
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

// Importieren von projektinternen Services, Modellen und Komponenten
import { DataService } from '../../services/data.service';
import { SurveyDialogComponent } from '../../components/survey-dialog-box/survey-dialog.component';
import { SurveyQuestionResultBoxComponent } from '../../components/survey-question-result-box/survey-question-result-box.component';
import { Survey } from '../../models/survey.model';
import { MatAccordion } from '@angular/material/expansion';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';

// Deklaration der Komponente
@Component({
  selector: 'app-survey-page', // CSS-Selektor für die Komponente
  standalone: true, // Standalone-Komponente (kein Modul notwendig)
  imports: [ // Alle verwendeten Module und Komponenten
    RouterModule,
    MatButtonModule,
    MatIcon,
    SurveyQuestionResultBoxComponent,
    MatDialogModule,
    SurveyDialogComponent,
    MatExpansionModule,
    MatAccordion,
    LoadingBoxComponent,
    LoadingFailedBoxComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Erlaubt die Verwendung von Custom Elements
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimierte Change Detection (bessere Performance)
  templateUrl: './survey-page.component.html', // Pfad zum HTML-Template
  styleUrls: ['./survey-page.component.scss'] // Pfad zum Stylesheet
})
export class SurveyPageComponent implements OnInit {

  // Arrays zur getrennten Verwaltung der Umfragen nach Status
  completedSurveys: Survey[] = []; // Abgeschlossene Umfragen
  ongoingSurveys: Survey[] = [];   // Laufende Umfragen

  // Statusvariablen (initial ohne Backend-Anbindung)
  isLoaded = true; // Gibt an, ob die Daten erfolgreich geladen wurden
  isFailed = false; // Gibt an, ob beim Laden ein Fehler aufgetreten ist

  // Constructor: Dependency Injection der Services
  constructor(
    private dataService: DataService, // Service zum Abrufen von Umfragedaten
    private dialog: MatDialog // Material-Service zum Öffnen von Dialogen
  ) {}

  // Angular Signal zum reaktiven Steuern des Accordion-Status
  panelOpenState = signal(false);

  // Lifecycle Hook: Wird einmal beim Initialisieren der Komponente aufgerufen
  ngOnInit(): void {
    // Lade Umfragen-Daten aus dem Service (Mocked, lokal vorhanden)
    this.ongoingSurveys = this.dataService.surveyList.filter(survey => survey.status === 'ongoing');
    this.completedSurveys = this.dataService.surveyList.filter(survey => survey.status === 'completed');
    console.log('Mocked survey data:', this.ongoingSurveys);

    // Alternativ (auskommentiert): Echte API-Anfrage zum Server
    /*
    this.dataService.getSurveyList().subscribe((surveys: Survey[]) => {
      this.ongoingSurveys = surveys.filter(survey => survey.status === 'ongoing');
      this.completedSurveys = surveys.filter(survey => survey.status === 'completed');
      this.isLoaded = true;  // Daten erfolgreich geladen
      this.isFailed = false; // Kein Fehler
    }, error => {
      console.error('Fehler beim Laden der Umfragen:', error);
      this.isFailed = true;  // Fehler beim Laden
      this.isLoaded = false; // Daten nicht geladen
    });
    */
  }

  // Öffnet den Dialog zur Erstellung einer neuen Umfrage
  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent, { // Öffnet die SurveyDialogComponent als Modal
      width: '600px', // Festgelegte Breite des Dialogs
      disableClose: true, // Verhindert Schließen durch Klick außerhalb
      data: {} // Übergebene Daten an den Dialog (momentan leer)
    });

    // Nach Schließen des Dialogs
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Nur wenn ein Ergebnis zurückgegeben wird
        console.log('New survey created:', result);

        // Je nach Status Umfrage einsortieren
        switch (result.status) {
          case 'ongoing':
            this.ongoingSurveys.push(result); // Zur Liste der laufenden Umfragen hinzufügen
            break;
          case 'completed':
            this.completedSurveys.push(result); // Zur Liste der abgeschlossenen Umfragen hinzufügen
            break;
          default:
            this.ongoingSurveys.push(result); // Fallback: Immer zu laufenden hinzufügen
        }
      }
    });
  }

  // Schließt eine laufende Umfrage ab und verschiebt sie zu den abgeschlossenen
  completeSurvey(survey: Survey): void {
    this.dataService.getSurveyResult(survey).subscribe({
      next: (resultSurvey: Survey) => { // Erfolgreiche Antwort
        this.ongoingSurveys = this.ongoingSurveys.filter(s => s !== survey); // Entfernen aus laufender Liste
        this.completedSurveys.push(resultSurvey); // Hinzufügen zur abgeschlossenen Liste
      },
      error: (err) => { // Fehlerbehandlung
        console.error('Fehler beim Abschließen der Umfrage:', err);
      }
    });
  }
}