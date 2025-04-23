import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SurveyPageComponent } from './survey-page.component';
import { of, throwError } from 'rxjs';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { Survey } from '../../models/survey.model';

describe('SurveyPageComponent', () => {
  let component: SurveyPageComponent;
  let fixture: ComponentFixture<SurveyPageComponent>;
  let mockDataService: any;
  let mockDialog: any;

  // Beispielhafte Testdaten für Umfragen
  const mockSurveys: Survey[] = [
    { title: 'Test 1', questions: [], status: 'ongoing' },
    { title: 'Test 2', questions: [], status: 'completed' }
  ];

  beforeEach(async () => {
    // Mock-Implementierung des DataService mit statischen surveyList-Daten
    mockDataService = {
      surveyList: mockSurveys,
      // Spy für getSurveyResult: simuliert erfolgreiche Rückgabe einer abgeschlossenen Umfrage
      getSurveyResult: jasmine.createSpy('getSurveyResult').and.returnValue(
        of({ ...mockSurveys[0], status: 'completed' })
      )
    };

    // Mock für Angular Material Dialog
    mockDialog = {
      // Simuliert einen geöffneten Dialog, der nach Schließen ein neues Survey-Objekt zurückgibt
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of({ title: 'Neu', questions: [], status: 'ongoing' })
      })
    };

    // Testmodul einrichten mit der echten Komponente und gemockten Services
    await TestBed.configureTestingModule({
      imports: [SurveyPageComponent], // dank standalone-Komponente direkt importierbar
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    // Komponente erstellen und initialisieren
    fixture = TestBed.createComponent(SurveyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ruft ngOnInit auf
  });

  // Test: Komponente wird korrekt erstellt
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // Test: ngOnInit sortiert Umfragen korrekt in "laufend" und "abgeschlossen"
  it('should categorize surveys on init', () => {
    expect(component.ongoingSurveys.length).toBe(1);
    expect(component.completedSurveys.length).toBe(1);
  });

  // Test: Öffnen des Dialogs und Hinzufügen einer neuen Umfrage
  it('should open dialog and add new survey', fakeAsync(() => {
    component.openDialog(); // Methode aufrufen
    tick(); // Zeit simulieren, um Subscription auf afterClosed() auszulösen

    expect(mockDialog.open).toHaveBeenCalled(); // Dialog wurde geöffnet
    expect(component.ongoingSurveys.some(s => s.title === 'Neu')).toBeTrue(); // Neue Umfrage hinzugefügt
  }));

  // Test: Eine laufende Umfrage wird abgeschlossen und verschoben
  it('should complete a survey and move it to completedSurveys', () => {
    const surveyToComplete = component.ongoingSurveys[0];
    component.completeSurvey(surveyToComplete); // Methode aufrufen

    expect(mockDataService.getSurveyResult).toHaveBeenCalledWith(surveyToComplete); // Service aufgerufen
    expect(component.ongoingSurveys).not.toContain(surveyToComplete); // Aus laufenden entfernt
    expect(component.completedSurveys.some(s => s.title === surveyToComplete.title)).toBeTrue(); // Zu abgeschlossenen hinzugefügt
  });

  // Test: Fehlerbehandlung beim Abschließen einer Umfrage
  it('should handle error when completing survey', () => {
    // Fehler simulieren
    mockDataService.getSurveyResult.and.returnValue(throwError(() => new Error('API Error')));
    spyOn(console, 'error'); // console.error überwachen

    component.completeSurvey(mockSurveys[0]); // Methode aufrufen

    // Erwartung: Fehler wurde korrekt geloggt
    expect(console.error).toHaveBeenCalledWith('Fehler beim Abschließen der Umfrage:', jasmine.any(Error));
  });
});